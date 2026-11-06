# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-11-04

### Added

- Use the latest released section of a case-insensitive `CHANGELOG.md` in the repository root or `docs/`, preserving Markdown and reference links, skipping `Unreleased`, and falling back to Git history when unusable.

### Changed

- **Breaking:** Replace Docker with a bundled Node.js 24 action, requiring runners with Node.js 24 support and enabling execution on Linux, macOS, and Windows.
- Run directly in the checkout without an extra repository clone; the `REPO` environment variable is no longer needed.

### Fixed

- Report Git fallback failures as failed action runs with an error message.

### Documentation

- Rewrite usage guidance with changelog selection rules, Git fallback behavior, and an updated release workflow; add release and CI badges.

### Maintenance

- Add TypeScript/esbuild builds and include regenerated action bundles in release commits.
- Add Vitest parser and bundled-action tests plus Linux, macOS, and Windows CI for builds, linting, type checks, and bundle freshness, including Windows newline handling.
- Adopt shared tooling configuration and update pnpm and development/workflow dependencies; contributor tooling now requires Node.js `^24.16.0 || >=26.3.0`.
- Add monthly automation that opens dependency-update pull requests.

## [2.0.10] - 2026-10-14

### Maintenance

- Introduce `bumpp`-based releases, automate GitHub release publishing for tags on the default branch, and synchronize stable major-version tags.
- Add weekly upstream-fork maintenance with Fork Tender.
- Add automated checks for repository Markdown links and project website links.
- Upgrade contributor tooling to pnpm 12 and update Prettier and repository-metadata workflow dependencies.

## [2.0.9] - 2026-04-08

### Fixed

- Preserve line breaks and Markdown list formatting in the `changelog` output instead of emitting literal `%0A` sequences.

### Maintenance

- Update shared Prettier tooling.

## [2.0.8] - 2026-04-07

### Changed

- Write the `changelog` output through `GITHUB_OUTPUT` instead of the deprecated `set-output` command.

### Documentation

- Correct the README to describe the repository as a modified fork.

### Maintenance

- Update shared Prettier tooling.

## [2.0.7] - 2026-03-31

### Maintenance

- Update pnpm and shared Prettier contributor tooling.
- Upgrade repository-metadata synchronization, restrict workflow permissions, pin checkout to a commit, and disable persisted checkout credentials.

## [2.0.6] - 2026-02-26

### Maintenance

- Update pnpm and Prettier tooling and upgrade checkout and repository-metadata workflow actions.

## [2.0.5] - 2026-02-01

### Maintenance

- Update pnpm and Prettier tooling and migrate the formatter configuration to TypeScript.

## [2.0.4] - 2025-12-08

### Maintenance

- Fix contributor-tool dependency hoisting by moving pnpm settings into the workspace configuration, and update pnpm and Prettier tooling.

## [2.0.3] - 2025-11-05

### Maintenance

- Add Prettier-based formatting and linting plus cleanup and tag-update scripts, with Node.js 22+ and pnpm 10 contributor requirements.
- Add package metadata and synchronize GitHub repository information through the repo-sync workflow.
- Remove inherited Docker-build, Super-Linter, release-generation, and Dependabot automation.

## [2.0.2] - 2024-06-08

### Added

- Generate Markdown lists of abbreviated commit hashes and subjects since the previous version-sorted tag, including all history when no tags exist.
- Provide a Docker GitHub Action with a `changelog` output, no `package.json` requirement, and support for workspaces owned by another user.

### Documentation

- Document full-history checkout and tag-triggered publishing with `actions/create-release`, including workflow examples and fork attribution.

### Maintenance

- Set up Docker build checks, Super-Linter, weekly Dependabot updates, and automatic release generation.

[2.0.2]: https://github.com/kitschpatrol/github-action-release-changelog/releases/tag/v2.0.2
[2.0.3]: https://github.com/kitschpatrol/github-action-release-changelog/compare/v2.0.2...v2.0.3
[2.0.4]: https://github.com/kitschpatrol/github-action-release-changelog/compare/v2.0.3...v2.0.4
[2.0.5]: https://github.com/kitschpatrol/github-action-release-changelog/compare/v2.0.4...v2.0.5
[2.0.6]: https://github.com/kitschpatrol/github-action-release-changelog/compare/v2.0.5...v2.0.6
[2.0.7]: https://github.com/kitschpatrol/github-action-release-changelog/compare/v2.0.6...v2.0.7
[2.0.8]: https://github.com/kitschpatrol/github-action-release-changelog/compare/v2.0.7...v2.0.8
[2.0.9]: https://github.com/kitschpatrol/github-action-release-changelog/compare/v2.0.8...v2.0.9
[2.0.10]: https://github.com/kitschpatrol/github-action-release-changelog/compare/v2.0.9...v2.0.10
[3.0.0]: https://github.com/kitschpatrol/github-action-release-changelog/compare/v2.0.10...v3.0.0
