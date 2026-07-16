import type { LogEntry, LogLevel, LoggerTransport } from "./types.js";

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[90m",
  info: "\x1b[37m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
};

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function formatMessage(entry: LogEntry, useColors: boolean): string {
  const color = LEVEL_COLORS[entry.level] ?? "";
  const levelTag = entry.level.toUpperCase().padEnd(5);
  const parts: string[] = [];

  if (useColors) {
    parts.push(`${color}${levelTag}${RESET}`);
  } else {
    parts.push(levelTag);
  }

  parts.push(formatTimestamp(entry.timestamp));

  if (entry.prefix) {
    const prefix = `[${entry.prefix}]`;
    if (useColors) {
      parts.push(`${DIM}${prefix}${RESET}`);
    } else {
      parts.push(prefix);
    }
  }

  parts.push(entry.message);

  if (entry.metadata && Object.keys(entry.metadata).length > 0) {
    parts.push(JSON.stringify(entry.metadata));
  }

  return parts.join(" ");
}

export class ConsoleTransport implements LoggerTransport {
  private readonly useColors: boolean;

  constructor(useColors: boolean) {
    this.useColors = useColors;
  }

  log(entry: LogEntry): void {
    const output = formatMessage(entry, this.useColors);

    switch (entry.level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      case "info":
        console.info(output);
        break;
      case "debug":
        console.debug(output);
        break;
    }
  }
}
