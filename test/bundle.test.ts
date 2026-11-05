import { execa } from 'execa'
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, onTestFinished } from 'vitest'

const distributionEntry = fileURLToPath(new URL('../dist/index.js', import.meta.url))
const OUTPUT_HEADER = /^changelog<</v

async function createRepository({ initializeGit = true, tagged = true } = {}) {
	const temporary = await mkdtemp(join(tmpdir(), 'release-changelog-'))
	onTestFinished(async () => rm(temporary, { force: true, recursive: true }))
	const repository = join(temporary, 'repository')
	const actionDirectory = join(temporary, 'action')
	await mkdir(repository)
	await mkdir(actionDirectory)
	// Running a copy outside the project verifies that dependencies are bundled.
	const entrypoint = join(actionDirectory, 'index.js')
	await copyFile(distributionEntry, entrypoint)
	await writeFile(join(actionDirectory, 'package.json'), '{"type":"module"}')
	const outputFile = join(temporary, 'output')
	/* eslint-disable ts/naming-convention -- Git and GitHub Actions define these environment variable names. */
	const environment = {
		...process.env,
		GIT_AUTHOR_EMAIL: 'test@example.com',
		GIT_AUTHOR_NAME: 'Test',
		GIT_COMMITTER_EMAIL: 'test@example.com',
		GIT_COMMITTER_NAME: 'Test',
		GIT_CONFIG_GLOBAL: join(temporary, 'gitconfig'),
		GIT_CONFIG_NOSYSTEM: '1',
		GITHUB_OUTPUT: outputFile,
	}
	/* eslint-enable ts/naming-convention */
	const git = async (...gitArguments: string[]) => {
		const { stdout } = await execa('git', gitArguments, { cwd: repository, env: environment })
		return stdout
	}

	let originalHash = ''
	let latestHash = ''
	if (initializeGit) {
		await git('init', '--quiet')
		await git(
			'-c',
			'commit.gpgsign=false',
			'commit',
			'--quiet',
			'--allow-empty',
			'-m',
			'Original change',
		)
		originalHash = await git('rev-parse', '--short', 'HEAD')
		if (tagged) {
			await git('tag', 'v1.0.0')
		}

		await git(
			'-c',
			'commit.gpgsign=false',
			'commit',
			'--quiet',
			'--allow-empty',
			'-m',
			'Latest change',
		)
		latestHash = await git('rev-parse', '--short', 'HEAD')
		if (tagged) {
			await git('tag', 'v2.0.0')
		}
	}

	return {
		fallback: tagged
			? ` - ${latestHash} Latest change`
			: ` - ${latestHash} Latest change\n - ${originalHash} Original change`,
		git,
		async run() {
			await writeFile(outputFile, '')
			await execa(process.execPath, [entrypoint], { cwd: repository, env: environment })
			const output = await readFile(outputFile, 'utf8')
			const lines = output.trimEnd().split('\n')
			const header = lines.shift() ?? ''
			expect(header).toMatch(OUTPUT_HEADER)
			const delimiter = header.slice('changelog<<'.length)
			expect(lines.pop()).toBe(delimiter)
			expect(lines).not.toContain(delimiter)
			return lines.join('\n')
		},
		async write(filename: string, content: string) {
			const destination = join(repository, filename)
			await mkdir(dirname(destination), { recursive: true })
			await writeFile(destination, content)
		},
	}
}

describe('bundled action', () => {
	it.each(['changelog.md', 'docs/changelog.md'])(
		'uses the vidup fixture release notes from %s instead of git-log notes',
		async (filename) => {
			const repository = await createRepository()
			const [source, expected] = await Promise.all([
				readFile(new URL('fixtures/vidup-changelog.md', import.meta.url), 'utf8'),
				readFile(new URL('fixtures/vidup-1.0.21.md', import.meta.url), 'utf8'),
			])
			await repository.write(filename, source)
			expect(await repository.run()).toBe(expected.trimEnd())
		},
	)

	it.each(['CHANGELOG.md', 'changelog.md', 'cHaNgElOg.Md', 'docs/ChAnGeLoG.mD'])(
		'uses the latest released section from %s',
		async (filename) => {
			// A curated changelog works without Git history or the REPO environment variable.
			const repository = await createRepository({ initializeGit: false })
			await repository.write(
				filename,
				'## [Unreleased]\n\n- Future change\n\n## [2.0.0]\n\n### Added\n\n- Latest change\n\n## [1.0.0]\n\n- Older change\n',
			)
			expect(await repository.run()).toBe('### Added\n\n- Latest change')
		},
	)

	it('prefers the root changelog over docs', async () => {
		const repository = await createRepository({ initializeGit: false })
		await repository.write('changelog.md', '## [2.0.0]\n\nRoot release notes\n')
		await repository.write('docs/CHANGELOG.md', '## [3.0.0]\n\nDocs release notes\n')
		expect(await repository.run()).toBe('Root release notes')
	})

	it('writes multiline Markdown containing output delimiters intact', async () => {
		const repository = await createRepository({ initializeGit: false })
		const notes = '### Added\n\n```text\nEOF\nEOF_\n```\n\n- See [API].'
		await repository.write(
			'CHANGELOG.md',
			`## [2.0.0]\n\n${notes}\n\n## [1.0.0]\n\n[API]: https://example.com/api\n`,
		)
		expect(await repository.run()).toBe(`${notes}\n\n[API]: https://example.com/api`)
	})

	it.each([true, false])(
		'falls back to git log without a changelog (tagged: %s)',
		async (tagged) => {
			const repository = await createRepository({ tagged })
			expect(await repository.run()).toBe(repository.fallback)
		},
	)

	it('preserves version sorting when selecting the previous tag', async () => {
		const repository = await createRepository()
		await repository.git('tag', '-d', 'v1.0.0', 'v2.0.0')
		await repository.git('tag', 'v1.9.0', 'HEAD~1')
		await repository.git('tag', 'v1.10.0')
		expect(await repository.run()).toBe(repository.fallback)
	})

	it('uses the sole tag as the start of the git-log range', async () => {
		const repository = await createRepository()
		await repository.git('tag', '-d', 'v2.0.0')
		expect(await repository.run()).toBe(repository.fallback)
	})

	it.each([
		['empty file', ''],
		['unrecognized format', '# Changelog\n\nFreeform notes\n'],
		['only Unreleased', '## [Unreleased]\n\n- Future change\n'],
		['empty latest release', '## [2.0.0]\n\n## [1.0.0]\n\n- Older change\n'],
	])('falls back to git log for %s', async (_description, content) => {
		const repository = await createRepository()
		await repository.write('CHANGELOG.md', content)
		expect(await repository.run()).toBe(repository.fallback)
	})

	it('falls back when the root file is unusable even if docs has release notes', async () => {
		const repository = await createRepository()
		await repository.write('CHANGELOG.md', '## [Unreleased]\n\n- Future change\n')
		await repository.write('docs/CHANGELOG.md', '## [2.0.0]\n\n- Docs release notes\n')
		expect(await repository.run()).toBe(repository.fallback)
	})

	it('does not search outside the root and immediate docs directory', async () => {
		const repository = await createRepository()
		await repository.write('docs/nested/CHANGELOG.md', '## [2.0.0]\n\n- Nested notes\n')
		await repository.write('other/CHANGELOG.md', '## [2.0.0]\n\n- Other notes\n')
		expect(await repository.run()).toBe(repository.fallback)
	})

	it('reports a failure when Git cannot generate fallback notes', async () => {
		const repository = await createRepository({ initializeGit: false })
		const result = repository.run()
		await expect(result).rejects.toHaveProperty('exitCode', 1)
		await expect(result).rejects.toHaveProperty(
			'stdout',
			expect.stringContaining('::error::Action failed with error:'),
		)
	})
})
