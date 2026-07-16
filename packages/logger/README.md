# @darshankachare/logger

A lightweight, type-safe logging library for Node.js and browser applications. Zero runtime dependencies.

## Features

- **Level-based filtering** — Show only messages at or above a configured severity
- **Prefix support** — Tag log entries with a source identifier
- **Metadata** — Attach structured data to any log call
- **Error handling** — Error objects are stringified with stack traces automatically
- **Extensible transports** — Console, file, cloud, or your own destination
- **ANSI colors** — Optional colorized console output
- **TypeScript** — Full type declarations included
- **ESM + CJS** — Dual module format for any runtime
- **Tree-shakeable** — Only what you use makes it into your bundle
- **Zero dependencies** — No runtime dependencies

## Installation

```bash
npm install @darshankachare/logger
# or
pnpm add @darshankachare/logger
# or
yarn add @darshankachare/logger
```

## Quick Start

```typescript
import { createLogger } from "@darshankachare/logger";

const logger = createLogger({ level: "info" });

logger.info("Server started");
logger.warn("Slow response detected");
logger.error("Database connection failed");
```

## API Reference

### `createLogger(options?)`

Creates a new Logger instance.

```typescript
import { createLogger } from "@darshankachare/logger";

const logger = createLogger({
  level: "info",
  prefix: "API",
  timestamp: true,
  colors: true,
});
```

### `Logger`

#### `logger.debug(message, metadata?)`
#### `logger.info(message, metadata?)`
#### `logger.warn(message, metadata?)`
#### `logger.error(message | Error, metadata?)`

```typescript
logger.info("User logged in", { userId: 42, role: "admin" });
logger.error(new Error("Connection timeout"), { attempt: 3 });
```

## Configuration

### `LoggerOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `level` | `LogLevel` | `"info"` | Minimum log level to emit |
| `prefix` | `string` | — | Optional source identifier |
| `timestamp` | `boolean` | `true` | Include ISO 8601 timestamp |
| `colors` | `boolean` | `false` | Enable ANSI colors in output |
| `transport` | `LoggerTransport` | `ConsoleTransport` | Custom transport destination |

### Log Levels

| Level | Priority | Description |
|---|---|---|
| `debug` | 0 | Detailed debugging information |
| `info` | 1 | General informational messages |
| `warn` | 2 | Warning conditions |
| `error` | 3 | Error conditions |

Setting `level: "warn"` hides `debug` and `info` messages and shows `warn` and `error`.

## Custom Transports

Implement the `LoggerTransport` interface to send logs anywhere:

```typescript
import type { LoggerTransport, LogEntry } from "@darshankachare/logger";
import { createLogger } from "@darshankachare/logger";

class FileTransport implements LoggerTransport {
  log(entry: LogEntry): void {
    // Write to file, send to cloud, etc.
  }
}

const logger = createLogger({
  transport: new FileTransport(),
});
```

### `LogEntry`

| Field | Type | Description |
|---|---|---|
| `level` | `LogLevel` | Severity of the log entry |
| `message` | `string` | Log message text |
| `timestamp` | `string` | ISO 8601 date string |
| `prefix?` | `string` | Source identifier, if configured |
| `metadata?` | `Record<string, unknown>` | Structured data, if provided |

## TypeScript Usage

```typescript
import { createLogger, type Logger, type LoggerOptions } from "@darshankachare/logger";

const options: LoggerOptions = { level: "debug", colors: true };
const logger: Logger = createLogger(options);
```

## License

[MIT](../../LICENSE)
