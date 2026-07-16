# @darshankachare/logger

## 2.1.0

### Minor Changes

- e0647f4: Improve logger architecture, formatting, and developer experience

  - Add pluggable formatter system with LogFormatter interface, TextFormatter, and JsonFormatter
  - Improve ConsoleTransport with backward-compatible options object constructor
  - Add child logger support with merged prefix and inherited metadata
  - Improve error serialization with cause chains and error codes
  - Add safe metadata serialization with circular reference and BigInt support
  - Export LEVELS constant and getLevelPriority for extensible level system
  - Comprehensive test suite with 81 tests

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

## 2.1.0

### Minor Changes

- Improve logger architecture, formatting, and developer experience

### Features

- **Pluggable formatters** — `LogFormatter` interface with built-in `TextFormatter` and `JsonFormatter`
- **ConsoleTransport improvements** — Backward-compatible constructor accepts options object (`{ formatter?, colors? }`)
- **Child loggers** — `logger.child({ prefix?, metadata? })` creates scoped loggers with merged prefix and inherited metadata
- **Error serialization** — `SerializedError` preserves stack traces, cause chains, and error codes
- **Safe metadata serialization** — Circular reference protection and BigInt support via `safeStringify`
- **Extensible level system** — `LEVELS` constant and `getLevelPriority()` for custom log level integration
- **Improved error method** — Accepts `string`, `Error`, or `unknown` values with safe fallback
- **TypeScript improvements** — New exports: `TextFormatter`, `JsonFormatter`, `safeStringify`, `LEVELS`, `getLevelPriority`, `SerializedError`, `ChildLoggerOptions`
- **81 tests** — Comprehensive test suite covering all APIs, edge cases, and backward compatibility
