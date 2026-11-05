# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.21] — 2026-11-02

### Documentation

- Correct the optional metadata-stripping options argument and a GUID typo in the readme. ([#1](https://github.com/kitschpatrol/vidup/pull/1))

### Maintenance

- Update runtime dependencies, including execa, lognow, ora, and pretty-ms; refresh development tools, pnpm, and the lockfile. ([#1](https://github.com/kitschpatrol/vidup/pull/1), [#2](https://github.com/kitschpatrol/vidup/pull/2))
- Update shared configuration and build before running lint and fix commands.
- Refresh CI actions and remove expired dependency release-age exemptions.

## [1.0.20] — 2026-10-06

### Breaking Changes

- Change supported Node.js versions from `>=24.16.0` to `^24.16.0 || >=26.3.0`.

### Documentation

- Refresh Node.js requirements, installation instructions, and CLI usage documentation.

### Maintenance

- Update dependencies and shared tooling.

## [1.0.19] — 2026-09-21

### Breaking Changes

- Raise the minimum Node.js version from 20.19.0 to 24.16.0.
- Replace the exported `log` object and library `verbose` options with `setLogger(logger)`.

### Added

- Support Homebrew installation with `brew install kitschpatrol/tap/vidup`.
- Allow library callers to inject a logger, or silence library logging with `setLogger()`.

### Changed

- Migrate logging to lognow and send metadata-stripping progress through the configured logger.

### Maintenance

- Update dependencies and shared configuration to version 8; adopt stricter lint rules.
- Publish the Homebrew formula as part of the release process.

## [1.0.18] — 2026-05-16

### Maintenance

- Update dependencies and build, cleanup, and publishing tools.

## [1.0.17] — 2026-04-06

### Maintenance

- Add Vitest tests and a CI workflow.
- Migrate the build from pkgroll to tsdown, with package and type checks using publint and Are the Types Wrong.
- Declare external runtime dependencies explicitly and update dependencies.

## [1.0.16] — 2025-12-08

### Fixed

- Correct pnpm dependency hoisting.

### Maintenance

- Update dependencies and move pnpm settings into `pnpm-workspace.yaml`.

## [1.0.15] — 2025-11-06

### Fixed

- Correct the CLI help documentation tooling version.

### Maintenance

- Update shared configuration and limit the TypeScript build to source files.

## [1.0.14] — 2025-11-04

### Maintenance

- Update dependencies and configure mdat-plugin-cli-help for CLI documentation generation.

## [1.0.13] — 2025-10-02

### Breaking Changes

- Raise the minimum Node.js version from 20.9.0 to 20.19.0.

### Changed

- Replace Chalk with picocolors for log coloring.

### Maintenance

- Update dependencies and shared tooling.

## [1.0.12] — 2025-03-04

### Fixed

- Correct the repository URL in package metadata.

### Maintenance

- Update dependencies, including TypeScript and shared configuration.

## [1.0.11] — 2025-03-02

### Fixed

- Update shared configuration to fix a Node.js 20 compatibility error.

## [1.0.10] — 2025-03-02

### Documentation

- Correct the documented minimum Node.js version to 20.9.0.

## [1.0.9] — 2025-03-02

### Changed

- Lower the minimum Node.js version from 22.0.0 to 20.9.0 and remove the pnpm engine constraint.

### Maintenance

- Update dependencies and move lint configuration from `package.json` into separate files.

## [1.0.8] — 2025-02-07

### Breaking Changes

- Raise the minimum Node.js version from 18.0.0 to 22.0.0.

### Maintenance

- Upgrade shared configuration to version 5, require pnpm 10.1.0 or newer, and update dependencies.

## [1.0.7] — 2025-02-01

### Maintenance

- Update runtime and development dependencies.

## [1.0.6] — 2024-09-14

### Fixed

- Restore the CLI source file that was accidentally excluded by ignore rules.

### Maintenance

- Update dependencies.

## [1.0.5] — 2024-09-07

### Breaking Changes

- Restrict package imports to the root entry point through an explicit exports map.

### Fixed

- Fix TypeScript build and declaration issues.

### Maintenance

- Migrate the build from tsup to pkgroll and move the CLI entry point to `dist/bin/cli.js`.
- Update dependencies and ESLint and import-order rules.

## [1.0.4] — 2024-06-08

### Fixed

- Read the CLI version explicitly from package metadata.

### Maintenance

- Update dependencies and raise the declared pnpm requirement to 9.0.0.

## [1.0.3] — 2024-04-08

### Fixed

- Fix CLI version detection by externalizing yargs and declaring it as a runtime dependency.

## [1.0.2] — 2024-04-08

### Fixed

- Correct the CLI's yargs version-command configuration.

## [1.0.1] — 2024-04-08

### Breaking Changes

- Rename exported types `VidupService`, `VidupSyncOptions`, and `VidupSyncReport` to `Service`, `SyncOptions`, and `SyncReport`.
- Remove `stripMetadata` from `SyncOptions`; call `stripVideoMetadataInDirectory` separately before synchronization.
- Change sync-report actions from `Created`, `Deleted`, `Unchanged`, and `Updated` to `Create`, `Delete`, `None`, and `Update`; make `stripMetadata` optional in reports.
- Stop expanding `~` in library directory paths; callers must resolve these paths before invoking the API.

### Added

- Export `stripVideoMetadataInDirectory` and its `StripOptions` type.

### Changed

- Make CLI metadata stripping opt-in with `--strip-metadata`.
- Include remote GUIDs and separate metadata-stripping results in CLI output.

### Documentation

- Correct the library usage example and clarify remote deletion and local metadata modification behavior.

## [1.0.0] — 2024-04-08

### Added

- Introduce a TypeScript CLI and Node.js library for synchronizing local videos to Bunny Stream.
- Create, replace, or delete remote videos to mirror a local directory, with one service selected per run.
- Track content hashes and remote synchronization state in `.vidup-state.json` using lowdb.
- Support dry runs, JSON reports, verbose logging, metadata stripping, and `~` directory paths.
- Export `syncVideoInDirectory`, synchronization types, and logging utilities.

### Documentation

- Document installation, CLI commands, library usage, and synchronization behavior.

[1.0.21]: https://github.com/kitschpatrol/vidup/compare/v1.0.20...v1.0.21
[1.0.20]: https://github.com/kitschpatrol/vidup/compare/v1.0.19...v1.0.20
[1.0.19]: https://github.com/kitschpatrol/vidup/compare/v1.0.18...v1.0.19
[1.0.18]: https://github.com/kitschpatrol/vidup/compare/v1.0.17...v1.0.18
[1.0.17]: https://github.com/kitschpatrol/vidup/compare/v1.0.16...v1.0.17
[1.0.16]: https://github.com/kitschpatrol/vidup/compare/v1.0.15...v1.0.16
[1.0.15]: https://github.com/kitschpatrol/vidup/compare/v1.0.14...v1.0.15
[1.0.14]: https://github.com/kitschpatrol/vidup/compare/v1.0.13...v1.0.14
[1.0.13]: https://github.com/kitschpatrol/vidup/compare/v1.0.12...v1.0.13
[1.0.12]: https://github.com/kitschpatrol/vidup/compare/v1.0.11...v1.0.12
[1.0.11]: https://github.com/kitschpatrol/vidup/compare/v1.0.10...v1.0.11
[1.0.10]: https://github.com/kitschpatrol/vidup/compare/v1.0.9...v1.0.10
[1.0.9]: https://github.com/kitschpatrol/vidup/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/kitschpatrol/vidup/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/kitschpatrol/vidup/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/kitschpatrol/vidup/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/kitschpatrol/vidup/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/kitschpatrol/vidup/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/kitschpatrol/vidup/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/kitschpatrol/vidup/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/kitschpatrol/vidup/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/kitschpatrol/vidup/releases/tag/v1.0.0
