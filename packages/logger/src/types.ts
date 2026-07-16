import type { LEVELS } from "./levels.js";

export type LogLevel = keyof typeof LEVELS;

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  prefix?: string;
  metadata?: Record<string, unknown>;
  error?: SerializedError;
}

export interface SerializedError {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
  code?: string;
}

export interface LoggerTransport {
  log(entry: LogEntry): void;
}

export interface LogFormatter {
  format(entry: LogEntry): string;
}

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
  colors?: boolean;
  transport?: LoggerTransport;
  formatter?: LogFormatter;
}

export interface ChildLoggerOptions {
  prefix?: string;
  metadata?: Record<string, unknown>;
}
