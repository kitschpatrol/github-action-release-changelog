import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { extractLatestRelease } from '../src/changelog'

describe('extractLatestRelease', () => {
	it('extracts exactly the 1.0.21 release from the vidup changelog fixture', async () => {
		const [source, expected] = await Promise.all([
			readFile(new URL('fixtures/vidup-changelog.md', import.meta.url), 'utf8'),
			readFile(new URL('fixtures/vidup-1.0.21.md', import.meta.url), 'utf8'),
		])
		expect(extractLatestRelease(source)).toBe(expected.trimEnd())
	})

	it('skips Unreleased and selects only the latest released section', () => {
		const source = `# Changelog

Introductory text.

## [Unreleased]

### Added

- Future change

## [2.0.0] - 2026-11-04

### Added

- Latest change

### Fixed

- A bug

## [1.0.0] - 2026-10-01

- Older change
`
		expect(extractLatestRelease(source)).toBe(
			'### Added\n\n- Latest change\n\n### Fixed\n\n- A bug',
		)
	})

	it.each(['2.0.0', 'v2.0.0', '[2.0.0]', '[v2.0.0]', '[2.0.0](https://example.com/release)'])(
		'supports the version heading %s',
		(version) => {
			expect(extractLatestRelease(`## ${version} - 2026-11-04\n\n- Latest change\n`)).toBe(
				'- Latest change',
			)
		},
	)

	it('supports CRLF line endings and a final section without a newline', () => {
		expect(
			extractLatestRelease(
				'## UNRELEASED\r\n\r\nFuture change\r\n\r\n## v2.0.0\r\n\r\n### Changed\r\n\r\n- Latest change',
			),
		).toBe('### Changed\n\n- Latest change')
	})

	it('preserves reference links and images defined outside the release', () => {
		const source = `## [2.0.0]

- See the [API] documentation and ![screenshot][image].

## [1.0.0]

- Older change

[API]: https://example.com/api
  "API documentation"
[image]: https://example.com/image.png
[unused]: https://example.com/unused
`
		expect(extractLatestRelease(source)).toBe(
			'- See the [API] documentation and ![screenshot][image].\n\n[API]: https://example.com/api\n  "API documentation"\n\n[image]: https://example.com/image.png',
		)
	})

	it('does not duplicate reference definitions already in the release', () => {
		const notes = '- See [API].\n\n[API]: https://example.com/api'
		expect(extractLatestRelease(`## [2.0.0]\n\n${notes}\n\n## [1.0.0]\n`)).toBe(notes)
	})

	it('resolves reference identifiers case-insensitively', () => {
		expect(
			extractLatestRelease(
				'## [2.0.0]\n\n- See [API].\n\n## [1.0.0]\n\n[api]: https://example.com/api\n',
			),
		).toBe('- See [API].\n\n[api]: https://example.com/api')
	})

	it('preserves code fences, indentation, and Markdown hard breaks', () => {
		const notes =
			'    indented code\n\n````markdown\n## [99.0.0]\n```\n[code]: example\nEOF\nEOF_\n````\n\n~~~\n## another code heading\n~~~\n\n- Final change  \n  continued'
		expect(extractLatestRelease(`## [2.0.0]\n\n${notes}\n\n## [1.0.0]\n\nOlder change\n`)).toBe(
			notes,
		)
	})

	it('does not treat headings inside an HTML block as release boundaries', () => {
		const notes = '<div>\n## [99.0.0]\n</div>\n\n- Latest change'
		expect(extractLatestRelease(`## [2.0.0]\n\n${notes}\n\n## [1.0.0]\n`)).toBe(notes)
	})

	it('ignores version headings nested inside quotes and lists', () => {
		expect(
			extractLatestRelease(
				'> ## [99.0.0]\n> Quoted version\n\n- ## [98.0.0]\n\n## [2.0.0]\n\n- Latest change\n',
			),
		).toBe('- Latest change')
	})

	it('supports setext release headings', () => {
		expect(
			extractLatestRelease(
				'[Unreleased]\n------------\n\nFuture change\n\n[2.0.0]\n-------\n\n- Latest change\n',
			),
		).toBe('- Latest change')
	})

	it('ends a release at the next top-level heading', () => {
		expect(
			extractLatestRelease('## [2.0.0]\n\n- Latest change\n\n# Appendix\n\nOther text\n'),
		).toBe('- Latest change')
	})

	it.each([
		['empty file', ''],
		['unrecognized format', '# Changelog\n\nFreeform notes\n'],
		['only Unreleased', '## [Unreleased]\n\n- Future change\n'],
		['empty released section', '## [2.0.0]\n\n  \n'],
		['empty latest release', '## [2.0.0]\n\n## [1.0.0]\n\n- Older change\n'],
		['only link definitions', '## [2.0.0]\n\n[2.0.0]: https://example.com/release\n'],
	])('returns no release for %s', (_description, source) => {
		expect(extractLatestRelease(source)).toBeUndefined()
	})
})
