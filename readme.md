<!-- title -->

# github-action-release-changelog

<!-- /title -->

<!-- badges({ githubRelease: true }) -->

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/license/mit)
[![CI](https://github.com/kitschpatrol/github-action-release-changelog/actions/workflows/ci.yml/badge.svg)](https://github.com/kitschpatrol/github-action-release-changelog/actions/workflows/ci.yml)
[![GitHub Release](https://img.shields.io/github/v/release/kitschpatrol/github-action-release-changelog?label=Release)](https://github.com/kitschpatrol/github-action-release-changelog/releases/latest)

<!-- /badges -->

<!-- short-description -->

**GitHub Action to generate release notes from a changelog or git history.**

<!-- /short-description -->

## Overview

Generate the body of a GitHub release from the latest released section of a [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) style changelog. If no usable section is found, generate a Markdown list of commits from the checked-out repository's git history.

This is a fork of [Bullrich/generate-release-changelog](https://github.com/bullrich/generate-release-changelog) by [Javier Bullrich](https://bullrich.dev), which builds on [ScottBrenner/generate-changelog-action](https://github.com/ScottBrenner/generate-changelog-action).

Pass the action's `changelog` output to your release publishing step as the release body.

## Fork changes

Changes from the original version this fork was based on:

- **Changelog release notes**\
  Find `CHANGELOG.md` case-insensitively in the repository root, then `./docs`. Use the latest released section, skipping `Unreleased`, and fall back to git history when needed.
- **Node.js 24 runtime**\
  Replace the shell script and Docker image with a bundled TypeScript action. Git commands run against the checked-out repository through `execa`; the `REPO` environment variable is no longer needed.
- **Multiline output**\
  Write release notes through `@actions/core`, preserving Markdown and avoiding collisions with output delimiters.
- **Development tooling**\
  Use pnpm, esbuild, Vitest, and [@kitschpatrol/shared-config](https://github.com/kitschpatrol/shared-config) for linting, formatting, and type checks through `ksc lint` and `ksc fix`. CI builds, lints, and tests on Linux, macOS, and Windows, and checks that the committed bundle is current.

## Getting started

Add a release workflow to your project's `.github/workflows` directory. Check out the full history and tags with `fetch-depth: 0` so the git-log fallback can determine the commit range.

```yaml
name: Create GitHub Release

on:
  push:
    tags:
      - "v[0-9]*.[0-9]*.[0-9]*"
      - "[0-9]*.[0-9]*.[0-9]*"

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Release notes
        id: release-notes
        uses: kitschpatrol/github-action-release-changelog@v2

      - name: Create release
        uses: kitschpatrol/github-action-release@13b1829f4e449586eb63ed614e0429a684cb291c # v3.0.3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          tag_name: ${{ github.ref_name }}
          name: ${{ github.ref_name }}
          body: ${{ steps.release-notes.outputs.changelog }}
```

The release-notes action has no inputs and needs no API token. The example grants `contents: write` to the workflow so the publishing step can create the GitHub release.

## Changelog selection

The action checks the repository root for a file named `CHANGELOG.md`, ignoring capitalization. If no file is found there, it checks `./docs`. The search does not descend into other directories.

The first matching file takes precedence. In that file, the action uses the first version section under a level-two heading, skipping `Unreleased`. Releases should appear in reverse chronological order. Bracketed versions, linked versions, and versions prefixed with `v` are supported.

For example:

```markdown
# Changelog

## [Unreleased]

- Work planned for a future release.

## [1.2.0] - 2026-11-04

### Added

- Support for changelog release notes.

## [1.1.0] - 2026-10-01

- Earlier changes.
```

The output is the body of `1.2.0`, beginning with `### Added`. The version heading is omitted. Markdown formatting is preserved, and any reference links used by the section are included even when their definitions appear elsewhere in the file.

If the selected file has no released section, or its latest released section is empty, the action falls back to git history. A root changelog still takes precedence over a file in `./docs`, even when the root file has no usable section.

## Git-log fallback

The fallback preserves the original tag-selection behavior: sort local tags using Git's `version:refname` order, then list commits from the second-to-last tag through `HEAD`. With one tag, use that tag as the start of the range. With no tags, include all commits in the checked-out history.

Each commit becomes a Markdown list item containing its abbreviated hash and subject, using `git log --oneline --no-decorate`.

## Output

The `changelog` output contains either the selected release section or the generated commit list. Use `${{ steps.release-notes.outputs.changelog }}` in a later step, where `release-notes` is the action step's ID.

## Maintainers

[kitschpatrol](https://github.com/kitschpatrol)

## Acknowledgments

Thanks to [Javier Bullrich](https://bullrich.dev) for [generate-release-changelog](https://github.com/bullrich/generate-release-changelog), and [Scott Brenner](https://github.com/ScottBrenner) and contributors for the original [generate-changelog-action](https://github.com/ScottBrenner/generate-changelog-action).

## License

[MIT](license.txt) © Scott Brenner and contributors (Original action)

[MIT](license.txt) © [Eric Mika](https://ericmika.com) (Fork changes)
