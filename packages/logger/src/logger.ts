import type { LoggerOptions, LogEntry, LogLevel, LoggerTransport, LogFormatter, ChildLoggerOptions, SerializedError } from "./types.js";
import { getLevelValue, shouldLog } from "./levels.js";
import { ConsoleTransport } from "./transports.js";
import { TextFormatter } from "./formatters.js";

const DEFAULTS = {
  level: "info" as LogLevel,
  timestamp: true,
  colors: false,
};

function normalizeError(error: unknown): SerializedError {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.cause !== undefined ? { cause: error.cause } : {}),
      ...(("code" in error && typeof (error as Record<string, unknown>).code === "string")
        ? { code: (error as Record<string, unknown>).code as string }
        : {}),
    };
  }

  if (error !== null && error !== undefined) {
    return {
      name: "UnknownError",
      message: String(error),
    };
  }

  return {
    name: "UnknownError",
    message: "An unknown error occurred",
  };
}

export class Logger {
  private readonly transport: LoggerTransport;
  private readonly formatter: LogFormatter;
  private readonly levelValue: number;
  private readonly levelName: LogLevel;
  readonly prefix?: string;
  private readonly timestampEnabled: boolean;
  private parentMetadata?: Record<string, unknown>;
  private childMetadata?: Record<string, unknown>;

  constructor(options: LoggerOptions = {}) {
    this.levelName = options.level ?? DEFAULTS.level;
    this.levelValue = getLevelValue(this.levelName);
    this.timestampEnabled = options.timestamp ?? DEFAULTS.timestamp;
    this.prefix = options.prefix;

    const colors = options.colors ?? DEFAULTS.colors;

    if (options.formatter) {
      this.formatter = options.formatter;
    } else {
      this.formatter = new TextFormatter({ colors });
    }

    this.transport = options.transport ?? new ConsoleTransport({ colors, formatter: this.formatter });
  }

  private write(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: unknown,
  ): void {
    const messageLevel = getLevelValue(level);

    if (!shouldLog(this.levelValue, messageLevel)) {
      return;
    }

    const mergedMetadata = this.mergeMetadata(metadata);

    const entry: LogEntry = {
      level,
      message,
      timestamp: this.timestampEnabled ? new Date().toISOString() : "",
      prefix: this.prefix,
      ...(mergedMetadata !== undefined ? { metadata: mergedMetadata } : {}),
      ...(error !== undefined ? { error: normalizeError(error) } : {}),
    };

    this.transport.log(entry);
  }

  private mergeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> | undefined {
    const base = this.parentMetadata ?? this.childMetadata;
    if (!base && !metadata) return undefined;
    if (!base) return metadata;
    if (!metadata) return { ...base };
    return { ...base, ...metadata };
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.write("debug", message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.write("info", message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.write("warn", message, metadata);
  }

  error(message: string | Error | unknown, metadata?: Record<string, unknown>): void {
    if (message === null || message === undefined) {
      this.write("error", "Unknown error", metadata, new Error("Unknown error"));
      return;
    }

    const error = message instanceof Error ? message : undefined;
    const text = typeof message === "string"
      ? message
      : message instanceof Error
        ? message.message
        : String(message);
    this.write("error", text, metadata, error);
  }

  child(options: ChildLoggerOptions): Logger {
    const mergedPrefix = options.prefix !== undefined
      ? [this.prefix, options.prefix].filter(Boolean).join(":")
      : this.prefix;

    const mergedBase = this.parentMetadata ?? this.childMetadata;
    const mergedMetadata = { ...mergedBase, ...options.metadata };

    const childOptions: LoggerOptions = {
      level: this.levelName,
      timestamp: this.timestampEnabled,
      transport: this.transport,
      formatter: this.formatter,
      prefix: mergedPrefix,
    };

    const child = new Logger(childOptions);
    child.parentMetadata = mergedMetadata;
    return child;
  }
}

export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options);
}
