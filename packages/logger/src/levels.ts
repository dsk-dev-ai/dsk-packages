import type { LogLevel } from "./types.js";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export function shouldLog(configuredLevel: LogLevel, messageLevel: LogLevel): boolean {
  return LEVEL_PRIORITY[messageLevel] >= LEVEL_PRIORITY[configuredLevel];
}

export function getLevelPriority(level: LogLevel): number {
  return LEVEL_PRIORITY[level];
}
