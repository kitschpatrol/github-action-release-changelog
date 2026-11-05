import type { Definition, Root } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toString } from 'mdast-util-to-string'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { visit } from 'unist-util-visit'

const VERSION_HEADING = /^\[?v?\d/iv

function trimBlankLines(value: string): string {
	return value.replaceAll(/^(?:[\t ]*\n)+|(?:\n[\t ]*)+$/gv, '')
}

/** Extract the first released section without reformatting its Markdown. */
export function extractLatestRelease(markdown: string): string | undefined {
	const source = markdown.replaceAll('\r\n', '\n')
	const tree = fromMarkdown(source)
	const releaseIndex = tree.children.findIndex(
		(node) =>
			node.type === 'heading' && node.depth === 2 && VERSION_HEADING.test(toString(node).trim()),
	)
	const start = tree.children[releaseIndex]?.position?.end.offset
	if (start === undefined) {
		return undefined
	}

	const nextHeadingIndex = tree.children.findIndex(
		(node, index) => index > releaseIndex && node.type === 'heading' && node.depth <= 2,
	)
	const end = tree.children[nextHeadingIndex]?.position?.start.offset ?? source.length
	const section: Root = {
		children: tree.children.slice(
			releaseIndex + 1,
			nextHeadingIndex === -1 ? undefined : nextHeadingIndex,
		),
		type: 'root',
	}
	// Link definitions alone do not constitute release notes.
	if (section.children.every((node) => node.type === 'definition')) {
		return undefined
	}

	const notes = trimBlankLines(source.slice(start, end))
	if (notes.trim().length === 0) {
		return undefined
	}

	const referencedIdentifiers = new Set<string>()
	visit(section, (node) => {
		if (node.type === 'linkReference' || node.type === 'imageReference') {
			referencedIdentifiers.add(node.identifier)
		}
	})

	// Markdown resolves duplicate definitions using the first occurrence.
	const definitions = new Map<string, Definition>()
	visit(tree, 'definition', (node) => {
		if (!definitions.has(node.identifier)) {
			definitions.set(node.identifier, node)
		}
	})
	const externalDefinitions: string[] = []
	for (const identifier of referencedIdentifiers) {
		const definition = definitions.get(identifier)
		const definitionStart = definition?.position?.start.offset
		const definitionEnd = definition?.position?.end.offset
		if (definitionStart === undefined || definitionEnd === undefined) {
			continue
		}

		if (definitionStart >= start && definitionEnd <= end) {
			continue
		}

		externalDefinitions.push(source.slice(definitionStart, definitionEnd))
	}

	return [notes, ...externalDefinitions].join('\n\n')
}

/** Search only the root and docs, stopping at the first matching file. */
export async function readChangelog(directory = process.cwd()): Promise<string | undefined> {
	for (const candidate of [directory, join(directory, 'docs')]) {
		let entries
		try {
			entries = await readdir(candidate, { withFileTypes: true })
		} catch (error) {
			const { code } = error as NodeJS.ErrnoException
			if (code === 'ENOENT' || code === 'ENOTDIR') {
				continue
			}

			throw error
		}

		const filename = entries
			.filter((entry) => entry.isFile() && entry.name.toLowerCase() === 'changelog.md')
			.map((entry) => entry.name)
			.toSorted()[0]
		if (filename !== undefined) {
			return extractLatestRelease(await readFile(join(candidate, filename), 'utf8'))
		}
	}

	return undefined
}
