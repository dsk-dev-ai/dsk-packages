export interface LoggerOptions {
  level: "debug" | "info" | "warn" | "error";
}

export type LogLevel = LoggerOptions["level"];
