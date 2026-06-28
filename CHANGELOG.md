# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Exported `InferClient` helper type, in PR [#7](https://github.com/teamonting/rpc/pull/7), by [@compulim](https://github.com/compulim)
- Added `defineContract()` and `defineImplementation()`, in PR [#8](https://github.com/teamonting/rpc/pull/8), by [@compulim](https://github.com/compulim)
- Enabled asynchronous `implement()` function, in PR [#9](https://github.com/teamonting/rpc/pull/9), by [@compulim](https://github.com/compulim)

### Changed

- 💥 Renamed `StubDeclaration` to `StubContract` for clarity, in PR [#8](https://github.com/teamonting/rpc/pull/8), by [@compulim](https://github.com/compulim)
- 💥 Changed `listen()` to return `Promise`, in PR [#9](https://github.com/teamonting/rpc/pull/9), by [@compulim](https://github.com/compulim)

## [0.1.0] - 2026-06-21

### Added

- Initial public release

[Unreleased]: https://github.com/teamonting/rpc/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/teamonting/rpc/releases/tag/v0.1.0
