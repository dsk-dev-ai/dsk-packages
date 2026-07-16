import type { LoggerOptions, LogEntry, LogLevel, LoggerTransport } from "./types.js";
import { shouldLog } from "./levels.js";
import { ConsoleTransport } from "./transports.js";

const DEFAULT_OPTIONS: Required<Pick<LoggerOptions, "level" | "timestamp" | "colors">> = {
  level: "info",
  timestamp: true,
  colors: false,
};

export class Logger {
  private readonly options: Required<Omit<LoggerOptions, "prefix" | "transport">>;
  private readonly prefix?: string;
  private readonly transport: LoggerTransport;

  constructor(options: LoggerOptions = {}) {
    this.options = {
      level: options.level ?? DEFAULT_OPTIONS.level,
      timestamp: options.timestamp ?? DEFAULT_OPTIONS.timestamp,
      colors: options.colors ?? DEFAULT_OPTIONS.colors,
    };
    this.prefix = options.prefix;

    if (options.transport) {
      this.transport = options.transport;
    } else {
      this.transport = new ConsoleTransport(this.options.colors);
    }
  }

  private write(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    if (!shouldLog(this.options.level, level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: this.options.timestamp ? new Date().toISOString() : "",
      prefix: this.prefix,
      metadata,
    };

    this.transport.log(entry);
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

  error(message: string | Error, metadata?: Record<string, unknown>): void {
    const text = message instanceof Error ? message.stack ?? message.message : message;
    this.write("error", text, metadata);
  }
}

export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options);
}
