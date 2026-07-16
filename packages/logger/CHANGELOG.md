# @darshankachare/logger

## 2.0.0

### Major Changes

- 6786ddd: Release @darshankachare/logger v1.0.0 production release

  Full implementation with:
  - Logger API with debug, info, warn, error levels
  - Level-based filtering
  - Prefix and timestamp support
  - Metadata and error object handling
  - Extensible transport system with ConsoleTransport
  - ANSI color support
  - Zero runtime dependencies
  - Full TypeScript declarations
  - ESM and CommonJS dual format

## 1.0.0

### Major Changes

- Production release of the logging library.

### Features

- Logger API with `debug`, `info`, `warn`, and `error` log levels
- Level-based filtering — only messages at or above the configured level are emitted
- Prefix support for identifying log sources
- ISO 8601 timestamps on every log entry
- Metadata support — pass structured data alongside log messages
- Error object handling — Error instances are stringified with stack traces
- Extensible transport system with built-in `ConsoleTransport`
- Custom transports — implement `LoggerTransport` for file, cloud, or any destination
- ANSI color support for console output
- Zero runtime dependencies
- Full TypeScript declarations
- ESM and CommonJS dual format
- Tree-shakeable
