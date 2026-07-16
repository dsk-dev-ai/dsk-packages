import type { LogEntry, LogFormatter } from "./types.js";
import { safeStringify } from "./safe-json.js";

const LEVEL_COLORS: Record<string, string> = {
  debug: "\x1b[90m",
  info: "\x1b[37m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
};

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";

function formatTime(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export interface TextFormatterOptions {
  colors?: boolean;
}

export class TextFormatter implements LogFormatter {
  private readonly colors: boolean;

  constructor(options?: TextFormatterOptions) {
    this.colors = options?.colors ?? false;
  }

  format(entry: LogEntry): string {
    const parts: string[] = [];
    const tag = entry.level.toUpperCase().padEnd(5);

    if (this.colors) {
      const c = LEVEL_COLORS[entry.level] ?? "";
      parts.push(`${c}${tag}${RESET}`);
    } else {
      parts.push(tag);
    }

    if (entry.timestamp) {
      parts.push(formatTime(entry.timestamp));
    }

    if (entry.prefix) {
      const p = `[${entry.prefix}]`;
      parts.push(this.colors ? `${DIM}${p}${RESET}` : p);
    }

    parts.push(entry.message);

    if (entry.error) {
      parts.push(entry.error.stack ?? `${entry.error.name}: ${entry.error.message}`);
    }

    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      parts.push(safeStringify(entry.metadata));
    }

    return parts.join(" ");
  }
}

export interface JsonFormatterOptions {
  space?: number;
}

export class JsonFormatter implements LogFormatter {
  private readonly space: number;

  constructor(options?: JsonFormatterOptions) {
    this.space = options?.space ?? 0;
  }

  format(entry: LogEntry): string {
    const base: Record<string, unknown> = {
      level: entry.level,
      message: entry.message,
      timestamp: entry.timestamp,
    };

    if (entry.prefix) {
      base.prefix = entry.prefix;
    }

    if (entry.metadata) {
      base.metadata = entry.metadata;
    }

    if (entry.error) {
      base.error = {
        name: entry.error.name,
        message: entry.error.message,
        ...(entry.error.stack ? { stack: entry.error.stack } : {}),
        ...(entry.error.cause !== undefined ? { cause: entry.error.cause } : {}),
        ...(entry.error.code ? { code: entry.error.code } : {}),
      };
    }

    return safeStringify(base, this.space);
  }
}
