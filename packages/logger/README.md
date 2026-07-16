# @darshankachare/logger

A lightweight, type-safe logging library for Node.js and browser applications. Zero runtime dependencies.

## Features

- **Level-based filtering** — Show only messages at or above a configured severity
- **Prefix support** — Tag log entries with a source identifier
- **Metadata** — Attach structured data to any log call
- **Error serialization** — Error objects are serialized with stack traces, cause chains, and error codes
- **Extensible transports** — Console, file, cloud, or your own destination
- **Pluggable formatters** — Text (with ANSI colors) or JSON output
- **Child loggers** — Create scoped loggers with inherited prefix and metadata
- **Safe JSON** — Circular reference protection and BigInt support
- **TypeScript** — Full type declarations included
- **ESM + CJS** — Dual module format for any runtime
- **Tree-shakeable** — Only what you use makes it into your bundle
- **Zero dependencies** — No runtime dependencies

## Installation

```bash
npm install @darshankachare/logger
pnpm add @darshankachare/logger
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

## Usage

### Basic

```typescript
import { createLogger } from "@darshankachare/logger";

const logger = createLogger({
  level: "debug",
  prefix: "App",
  colors: true,
});

logger.debug("Connecting to database...");
logger.info("Server listening on port 3000");
logger.warn("Memory usage high");
logger.error("Unhandled rejection", { promiseId: 42 });
```

### With metadata

```typescript
logger.info("User login", {
  userId: 42,
  role: "admin",
  ip: "192.168.1.1",
});
```

### Error handling

```typescript
try {
  throw new Error("Connection refused");
} catch (err) {
  logger.error(err);
}
```

### Error with cause chain

```typescript
const inner = new Error("Disk full");
const outer = new Error("Write failed", { cause: inner });
logger.error(outer);
// Serializes with full stack traces and cause information
```

### Child loggers

```typescript
const root = createLogger({ level: "debug", prefix: "App" });
const dbLogger = root.child({ prefix: "DB", metadata: { module: "database" } });

dbLogger.info("Connected");   // prefix: "App:DB", metadata: { module: "database" }
dbLogger.error("Timeout", { query: "SELECT *" });
// metadata: { module: "database", query: "SELECT *" }
```

### JSON logging

```typescript
import { createLogger, JsonFormatter, ConsoleTransport } from "@darshankachare/logger";

const logger = createLogger({
  level: "info",
  transport: new ConsoleTransport({ formatter: new JsonFormatter() }),
});

logger.info("Order placed", { orderId: 1001, total: 29.99 });
// {"level":"info","message":"Order placed","timestamp":"...","metadata":{"orderId":1001,"total":29.99}}
```

### Custom transport

Implement the `LoggerTransport` interface to send logs anywhere:

```typescript
import type { LoggerTransport, LogEntry } from "@darshankachare/logger";

class FileTransport implements LoggerTransport {
  log(entry: LogEntry): void {
    // write to file, send to cloud, etc.
  }
}

const logger = createLogger({
  transport: new FileTransport(),
});
```

### Custom formatter

```typescript
import type { LogFormatter, LogEntry } from "@darshankachare/logger";

class CustomFormatter implements LogFormatter {
  format(entry: LogEntry): string {
    return `[${entry.level}] ${entry.message}`;
  }
}

const logger = createLogger({
  formatter: new CustomFormatter(),
});
```

## API Reference

### `createLogger(options?)`

Creates a new Logger instance.

### `Logger`

| Method | Signature | Description |
|---|---|---|
| `debug` | `(message: string, metadata?)` | Log at debug level |
| `info` | `(message: string, metadata?)` | Log at info level |
| `warn` | `(message: string, metadata?)` | Log at warn level |
| `error` | `(message, metadata?)` | Log at error level. Accepts `string`, `Error`, or `unknown` |
| `child` | `(options: ChildLoggerOptions)` | Create a scoped child logger |

### `LoggerOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `level` | `LogLevel` | `"info"` | Minimum log level to emit |
| `prefix` | `string` | — | Optional source identifier |
| `timestamp` | `boolean` | `true` | Include ISO 8601 timestamp |
| `colors` | `boolean` | `false` | Enable ANSI colors in text output |
| `transport` | `LoggerTransport` | `ConsoleTransport` | Custom transport destination |
| `formatter` | `LogFormatter` | `TextFormatter` | Custom formatter |

### `LogLevel`

`"debug"` | `"info"` | `"warn"` | `"error"`

Setting `level: "warn"` hides `debug` and `info` messages and shows `warn` and `error`.

### `LogEntry`

| Field | Type | Description |
|---|---|---|
| `level` | `LogLevel` | Severity of the log entry |
| `message` | `string` | Log message text |
| `timestamp` | `string` | ISO 8601 date string |
| `prefix?` | `string` | Source identifier, if configured |
| `metadata?` | `Record<string, unknown>` | Structured data, if provided |
| `error?` | `SerializedError` | Error details, if provided |

### `LEVELS`

```typescript
{ debug: 0, info: 1, warn: 2, error: 3 }
```

A numeric priority map for extending the level system with custom levels.

### `ConsoleTransport`

Backward-compatible. Accepts:

- No arguments — plain text without colors
- `boolean` — `true` enables colors (legacy)
- `ConsoleTransportOptions` — `{ formatter?, colors? }`

```typescript
new ConsoleTransport(true);
new ConsoleTransport({ formatter: new JsonFormatter() });
new ConsoleTransport({ formatter: new TextFormatter({ colors: true }) });
```

### `TextFormatter` / `JsonFormatter`

```typescript
new TextFormatter({ colors: true });
new JsonFormatter({ space: 2 }); // pretty-print
```

### `SerializedError`

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Error class name |
| `message` | `string` | Error message |
| `stack?` | `string` | Stack trace |
| `cause?` | `unknown` | Error cause chain |
| `code?` | `string` | Error code (e.g. `ENOENT`) |

## Browser Usage

Works in the browser with any bundler (webpack, Vite, esbuild, etc.). Colors are automatically disabled when the output is not a terminal.

## Node.js Usage

Works with Node.js >= 18. Colors are supported in TTY terminals when `colors: true` is set.

## TypeScript

Full type declarations are included. All public APIs are fully typed.

```typescript
import { createLogger, type Logger, type LoggerOptions } from "@darshankachare/logger";

const options: LoggerOptions = { level: "debug" };
const logger: Logger = createLogger(options);
```

## License

[MIT](../../LICENSE)
