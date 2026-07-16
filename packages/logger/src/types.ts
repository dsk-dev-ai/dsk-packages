export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  prefix?: string;
  metadata?: Record<string, unknown>;
}

export interface LoggerTransport {
  log(entry: LogEntry): void;
}

export interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  timestamp?: boolean;
  colors?: boolean;
  transport?: LoggerTransport;
}
