import { describe, it, expect, vi, beforeEach } from "vitest";
import { createLogger, Logger, ConsoleTransport, TextFormatter, JsonFormatter, LEVELS, getLevelPriority, safeStringify } from "../src/index.js";
import type { LoggerTransport, LogEntry, LogFormatter } from "../src/index.js";

// ---------------------------------------------------------------------------
// 1. Logger creation
// ---------------------------------------------------------------------------
describe("createLogger", () => {
  it("returns a Logger instance with no arguments", () => {
    expect(createLogger()).toBeInstanceOf(Logger);
  });

  it("returns a Logger instance with empty options", () => {
    expect(createLogger({})).toBeInstanceOf(Logger);
  });

  it("returns a Logger instance with all options", () => {
    const logger = createLogger({
      level: "debug",
      prefix: "test",
      timestamp: false,
      colors: true,
      formatter: new TextFormatter(),
      transport: { log: () => {} },
    });
    expect(logger).toBeInstanceOf(Logger);
  });

  it("exposes the prefix as a readonly property", () => {
    const logger = createLogger({ prefix: "API" });
    expect(logger.prefix).toBe("API");
  });

  it("prefix is undefined when not set", () => {
    const logger = createLogger();
    expect(logger.prefix).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 2. Log levels – filtering
// ---------------------------------------------------------------------------
describe("level filtering", () => {
  let spy: ReturnType<typeof vi.fn>;
  let transport: LoggerTransport;

  beforeEach(() => {
    spy = vi.fn();
    transport = { log: spy };
  });

  it("debug level shows all messages", () => {
    const log = createLogger({ level: "debug", transport });
    log.debug("d"); log.info("i"); log.warn("w"); log.error("e");
    expect(spy).toHaveBeenCalledTimes(4);
  });

  it("info level hides debug", () => {
    const log = createLogger({ level: "info", transport });
    log.debug("d"); log.info("i");
    const levels = spy.mock.calls.map((c: [LogEntry]) => c[0].level);
    expect(levels).toEqual(["info"]);
  });

  it("warn level hides debug and info", () => {
    const log = createLogger({ level: "warn", transport });
    log.debug("d"); log.info("i"); log.warn("w"); log.error("e");
    const levels = spy.mock.calls.map((c: [LogEntry]) => c[0].level);
    expect(levels).toEqual(["warn", "error"]);
  });

  it("error level shows only error", () => {
    const log = createLogger({ level: "error", transport });
    log.debug("d"); log.info("i"); log.warn("w"); log.error("e");
    const levels = spy.mock.calls.map((c: [LogEntry]) => c[0].level);
    expect(levels).toEqual(["error"]);
  });

  it("silently filters when no messages meet threshold", () => {
    const log = createLogger({ level: "error", transport });
    log.debug("d"); log.info("i");
    expect(spy).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 3. Log levels – value system
// ---------------------------------------------------------------------------
describe("LEVELS", () => {
  it("defines debug as 0", () => { expect(LEVELS.debug).toBe(0); });
  it("defines info as 1", () => { expect(LEVELS.info).toBe(1); });
  it("defines warn as 2", () => { expect(LEVELS.warn).toBe(2); });
  it("defines error as 3", () => { expect(LEVELS.error).toBe(3); });

  it("getLevelPriority returns correct number", () => {
    expect(getLevelPriority("debug")).toBe(0);
    expect(getLevelPriority("error")).toBe(3);
  });

  it("getLevelPriority returns -1 for unknown level", () => {
    expect(getLevelPriority("trace")).toBe(-1);
  });
});

// ---------------------------------------------------------------------------
// 4. Logger – message content
// ---------------------------------------------------------------------------
describe("message content", () => {
  let spy: ReturnType<typeof vi.fn>;
  let transport: LoggerTransport;

  beforeEach(() => {
    spy = vi.fn();
    transport = { log: spy };
  });

  it("each log method passes the correct level", () => {
    const log = createLogger({ level: "debug", transport });
    log.debug("x"); log.info("x"); log.warn("x"); log.error("x");
    const levels = spy.mock.calls.map((c: [LogEntry]) => c[0].level);
    expect(levels).toEqual(["debug", "info", "warn", "error"]);
  });

  it("passes the message text", () => {
    const log = createLogger({ level: "debug", transport });
    log.info("hello");
    expect(spy.mock.calls[0][0].message).toBe("hello");
  });

  it("passes empty string", () => {
    const log = createLogger({ level: "debug", transport });
    log.info("");
    expect(spy.mock.calls[0][0].message).toBe("");
  });
});

// ---------------------------------------------------------------------------
// 5. Prefix
// ---------------------------------------------------------------------------
describe("prefix", () => {
  let spy: ReturnType<typeof vi.fn>;
  let transport: LoggerTransport;

  beforeEach(() => {
    spy = vi.fn();
    transport = { log: spy };
  });

  it("sets prefix on entry when configured", () => {
    const log = createLogger({ level: "debug", prefix: "API", transport });
    log.info("msg");
    expect(spy.mock.calls[0][0].prefix).toBe("API");
  });

  it("omits prefix when not configured", () => {
    const log = createLogger({ level: "debug", transport });
    log.info("msg");
    expect(spy.mock.calls[0][0].prefix).toBeUndefined();
  });

  it("prefix is empty string when set to empty", () => {
    const log = createLogger({ level: "debug", prefix: "", transport });
    log.info("msg");
    expect(spy.mock.calls[0][0].prefix).toBe("");
  });
});

// ---------------------------------------------------------------------------
// 6. Timestamp
// ---------------------------------------------------------------------------
describe("timestamp", () => {
  let spy: ReturnType<typeof vi.fn>;
  let transport: LoggerTransport;

  beforeEach(() => {
    spy = vi.fn();
    transport = { log: spy };
  });

  it("generates a valid ISO timestamp by default", () => {
    const log = createLogger({ level: "debug", transport });
    log.info("msg");
    const ts = spy.mock.calls[0][0].timestamp;
    expect(ts).toBeTruthy();
    expect(() => new Date(ts)).not.toThrow();
  });

  it("produces empty string when timestamp disabled", () => {
    const log = createLogger({ level: "debug", timestamp: false, transport });
    log.info("msg");
    expect(spy.mock.calls[0][0].timestamp).toBe("");
  });
});

// ---------------------------------------------------------------------------
// 7. Metadata
// ---------------------------------------------------------------------------
describe("metadata", () => {
  let spy: ReturnType<typeof vi.fn>;
  let transport: LoggerTransport;

  beforeEach(() => {
    spy = vi.fn();
    transport = { log: spy };
  });

  it("attaches metadata when provided", () => {
    const log = createLogger({ level: "debug", transport });
    const meta = { userId: 42 };
    log.info("msg", meta);
    expect(spy.mock.calls[0][0].metadata).toEqual(meta);
  });

  it("omits metadata when not provided", () => {
    const log = createLogger({ level: "debug", transport });
    log.info("msg");
    expect(spy.mock.calls[0][0].metadata).toBeUndefined();
  });

  it("supports nested metadata", () => {
    const log = createLogger({ level: "debug", transport });
    log.info("msg", { user: { id: 1, roles: ["admin"] } });
    expect(spy.mock.calls[0][0].metadata).toEqual({ user: { id: 1, roles: ["admin"] } });
  });

  it("supports metadata with all level methods", () => {
    const log = createLogger({ level: "debug", transport });
    const meta = { x: 1 };
    log.debug("d", meta); log.info("i", meta); log.warn("w", meta); log.error("e", meta);
    for (const call of spy.mock.calls) {
      expect(call[0].metadata).toEqual(meta);
    }
  });

  it("empty metadata object is still passed", () => {
    const log = createLogger({ level: "debug", transport });
    log.info("msg", {});
    expect(spy.mock.calls[0][0].metadata).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// 8. Error handling
// ---------------------------------------------------------------------------
describe("error handling", () => {
  let spy: ReturnType<typeof vi.fn>;
  let transport: LoggerTransport;

  beforeEach(() => {
    spy = vi.fn();
    transport = { log: spy };
  });

  it("accepts a string error message", () => {
    const log = createLogger({ level: "debug", transport });
    log.error("something broke");
    expect(spy.mock.calls[0][0].message).toBe("something broke");
  });

  it("accepts an Error object", () => {
    const log = createLogger({ level: "debug", transport });
    log.error(new Error("fail"));
    expect(spy.mock.calls[0][0].message).toBe("fail");
  });

  it("serializes Error with stack trace in error field", () => {
    const log = createLogger({ level: "debug", transport });
    const err = new Error("boom");
    log.error(err);
    const entry = spy.mock.calls[0][0];
    expect(entry.error).toBeDefined();
    expect(entry.error.name).toBe("Error");
    expect(entry.error.message).toBe("boom");
    expect(entry.error.stack).toContain("Error: boom");
  });

  it("preserves Error cause", () => {
    const log = createLogger({ level: "debug", transport });
    const inner = new Error("root cause");
    const outer = new Error("wrapped", { cause: inner });
    log.error(outer);
    expect(spy.mock.calls[0][0].error.cause).toBe(inner);
  });

  it("includes metadata alongside error", () => {
    const log = createLogger({ level: "debug", transport });
    log.error(new Error("fail"), { db: "main" });
    expect(spy.mock.calls[0][0].metadata).toEqual({ db: "main" });
  });

  it("handles non-Error thrown values safely", () => {
    const log = createLogger({ level: "debug", transport });
    log.error(null as unknown as Error);
    const entry = spy.mock.calls[0][0];
    expect(entry.message).toBe("Unknown error");
    expect(entry.error).toBeDefined();
    expect(entry.error?.name).toBe("Error");
  });

  it("serializes undefined as safe unknown error", () => {
    const log = createLogger({ level: "debug", transport });
    log.error(undefined as unknown as Error);
    const entry = spy.mock.calls[0][0];
    expect(entry.message).toBe("Unknown error");
  });
});

// ---------------------------------------------------------------------------
// 9. Custom transports
// ---------------------------------------------------------------------------
describe("custom transports", () => {
  it("uses a custom transport", () => {
    const spy = vi.fn();
    const log = createLogger({ level: "debug", transport: { log: spy } });
    log.info("msg");
    expect(spy).toHaveBeenCalledOnce();
  });

  it("receives complete LogEntry", () => {
    const entries: LogEntry[] = [];
    const log = createLogger({
      level: "debug",
      prefix: "Svc",
      transport: { log: (e) => { entries.push(e); } },
    });
    log.info("started", { port: 3000 });
    expect(entries[0].level).toBe("info");
    expect(entries[0].message).toBe("started");
    expect(entries[0].prefix).toBe("Svc");
    expect(entries[0].metadata).toEqual({ port: 3000 });
  });

  it("supports multiple log calls", () => {
    const entries: LogEntry[] = [];
    const log = createLogger({ level: "debug", transport: { log: (e) => { entries.push(e); } } });
    log.info("a"); log.warn("b"); log.error("c");
    expect(entries).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// 10. ConsoleTransport
// ---------------------------------------------------------------------------
describe("ConsoleTransport", () => {
  it("calls console.error for error level", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const t = new ConsoleTransport();
    t.log({ level: "error", message: "e", timestamp: "2024-01-01T00:00:00.000Z" });
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it("calls console.warn for warn level", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const t = new ConsoleTransport();
    t.log({ level: "warn", message: "w", timestamp: "2024-01-01T00:00:00.000Z" });
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it("calls console.info for info level", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const t = new ConsoleTransport();
    t.log({ level: "info", message: "i", timestamp: "2024-01-01T00:00:00.000Z" });
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it("calls console.debug for debug level", () => {
    const spy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const t = new ConsoleTransport();
    t.log({ level: "debug", message: "d", timestamp: "2024-01-01T00:00:00.000Z" });
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it("backward-compatible: accepts boolean useColors", () => {
    const t = new ConsoleTransport(true);
    expect(t).toBeInstanceOf(ConsoleTransport);
  });

  it("backward-compatible: accepts no argument", () => {
    const t = new ConsoleTransport();
    expect(t).toBeInstanceOf(ConsoleTransport);
  });

  it("accepts options object with formatter", () => {
    const t = new ConsoleTransport({ formatter: new JsonFormatter() });
    expect(t).toBeInstanceOf(ConsoleTransport);
  });
});

// ---------------------------------------------------------------------------
// 11. TextFormatter
// ---------------------------------------------------------------------------
describe("TextFormatter", () => {
  const entry: LogEntry = {
    level: "info",
    message: "hello",
    timestamp: "2024-06-15T10:30:00.000Z",
  };

  it("produces a string", () => {
    const f = new TextFormatter();
    expect(typeof f.format(entry)).toBe("string");
  });

  it("includes level tag", () => {
    const f = new TextFormatter();
    expect(f.format(entry)).toContain("INFO");
  });

  it("includes formatted time from ISO timestamp", () => {
    const f = new TextFormatter();
    expect(f.format(entry)).toContain("10:30:00");
  });

  it("includes prefix when present", () => {
    const f = new TextFormatter();
    const out = f.format({ ...entry, prefix: "API" });
    expect(out).toContain("[API]");
  });

  it("includes metadata when present", () => {
    const f = new TextFormatter();
    const out = f.format({ ...entry, metadata: { key: "val" } });
    expect(out).toContain("val");
  });

  it("includes error stack when present", () => {
    const f = new TextFormatter();
    const out = f.format({
      ...entry,
      error: { name: "Error", message: "fail", stack: "Error: fail\n    at file.ts:1" },
    });
    expect(out).toContain("Error: fail");
  });

  it("works with empty fields", () => {
    const f = new TextFormatter();
    const out = f.format({
      level: "debug",
      message: "",
      timestamp: "",
    });
    expect(typeof out).toBe("string");
  });
});

// ---------------------------------------------------------------------------
// 12. JsonFormatter
// ---------------------------------------------------------------------------
describe("JsonFormatter", () => {
  const entry: LogEntry = {
    level: "info",
    message: "hello",
    timestamp: "2024-06-15T10:30:00.000Z",
  };

  it("produces a valid JSON string", () => {
    const f = new JsonFormatter();
    const out = f.format(entry);
    const parsed = JSON.parse(out);
    expect(parsed.level).toBe("info");
    expect(parsed.message).toBe("hello");
  });

  it("omits undefined fields", () => {
    const f = new JsonFormatter();
    const out = f.format(entry);
    const parsed = JSON.parse(out);
    expect(parsed.prefix).toBeUndefined();
    expect(parsed.metadata).toBeUndefined();
    expect(parsed.error).toBeUndefined();
  });

  it("includes prefix when present", () => {
    const f = new JsonFormatter();
    const out = f.format({ ...entry, prefix: "API" });
    expect(JSON.parse(out).prefix).toBe("API");
  });

  it("includes metadata when present", () => {
    const f = new JsonFormatter();
    const out = f.format({ ...entry, metadata: { userId: 1 } });
    expect(JSON.parse(out).metadata.userId).toBe(1);
  });

  it("includes error fields", () => {
    const f = new JsonFormatter();
    const out = f.format({
      ...entry,
      error: { name: "Error", message: "fail", stack: "Error: fail\n    at t.ts:1" },
    });
    const parsed = JSON.parse(out);
    expect(parsed.error.name).toBe("Error");
    expect(parsed.error.message).toBe("fail");
    expect(parsed.error.stack).toContain("t.ts:1");
  });

  it("supports pretty-print with space option", () => {
    const f = new JsonFormatter({ space: 2 });
    const out = f.format(entry);
    expect(out).toContain("\n  ");
  });

  it("handles large metadata without throwing", () => {
    const big: Record<string, unknown> = {};
    for (let i = 0; i < 100; i++) big[`k${i}`] = `v${i}`;
    const f = new JsonFormatter();
    expect(() => f.format({ ...entry, metadata: big })).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 13. safeStringify
// ---------------------------------------------------------------------------
describe("safeStringify", () => {
  it("stringifies plain objects", () => {
    expect(safeStringify({ a: 1 })).toBe('{"a":1}');
  });

  it("handles circular references without throwing", () => {
    const obj: Record<string, unknown> = { a: 1 };
    obj.self = obj;
    expect(() => safeStringify(obj)).not.toThrow();
    const out = safeStringify(obj);
    expect(out).toContain("[Circircular]");
  });

  it("converts BigInt to string", () => {
    const out = safeStringify({ n: BigInt(42) });
    expect(out).toContain("42");
  });

  it("serializes Error objects", () => {
    const out = safeStringify(new Error("test"));
    const parsed = JSON.parse(out);
    expect(parsed.name).toBe("Error");
    expect(parsed.message).toBe("test");
  });

  it("stringifies primitives", () => {
    expect(safeStringify("hello")).toBe('"hello"');
    expect(safeStringify(42)).toBe("42");
  });
});

// ---------------------------------------------------------------------------
// 14. Logger – child loggers
// ---------------------------------------------------------------------------
describe("child loggers", () => {
  let entries: LogEntry[];
  let transport: LoggerTransport;

  beforeEach(() => {
    entries = [];
    transport = { log: (e) => { entries.push(e); } };
  });

  it("child() returns a Logger instance", () => {
    const parent = createLogger({ level: "debug", transport });
    const child = parent.child({ prefix: "child" });
    expect(child).toBeInstanceOf(Logger);
  });

  it("child inherits parent level", () => {
    const parent = createLogger({ level: "warn", transport });
    const child = parent.child({});
    child.debug("x");
    child.warn("y");
    expect(entries).toHaveLength(1);
    expect(entries[0]?.level).toBe("warn");
  });

  it("child merges prefix with colon separator", () => {
    const parent = createLogger({ level: "debug", prefix: "App", transport });
    const child = parent.child({ prefix: "DB" });
    child.info("conn");
    expect(entries[0]?.prefix).toBe("App:DB");
  });

  it("child inherits parent prefix when no prefix given", () => {
    const parent = createLogger({ level: "debug", prefix: "App", transport });
    const child = parent.child({});
    child.info("msg");
    expect(entries[0]?.prefix).toBe("App");
  });

+  it("child merges base metadata", () => {
+    const parent = createLogger({ level: "debug", transport });
+    const child = parent.child({ metadata: { module: "auth" } });
+    child.info("login", { userId: 1 });
+    expect(entries[0]?.metadata).toEqual({ module: "auth", userId: 1 });
+  });
+
+  it("nested child merges parent metadata chain", () => {
+    const parent = createLogger({ level: "debug", transport });
+    const child1 = parent.child({ metadata: { app: "demo" } });
+    child1.info("init");
+
+    const child2 = child1.child({ metadata: { module: "auth" } });
+    child2.info("login", { userId: 1 });
+
+    expect(entries[1]?.metadata).toEqual({
+      app: "demo",
+      module: "auth",
+      userId: 1,
+    });
+  });
+
  it("child metadata does not mutate parent", () => {
    const parent = createLogger({ level: "debug", transport });
    parent.child({ metadata: { childOnly: true } });
    parent.info("parent");
    expect(entries[0]?.metadata).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 15. Custom formatters
// ---------------------------------------------------------------------------
describe("custom formatters", () => {
  it("uses a custom LogFormatter via ConsoleTransport", () => {
    class UpperFormatter implements LogFormatter {
      format(entry: LogEntry): string {
        return entry.message.toUpperCase();
      }
    }
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    const t = new ConsoleTransport({ formatter: new UpperFormatter() });
    t.log({ level: "info", message: "hello", timestamp: "" });
    expect(spy).toHaveBeenCalledWith("HELLO");
    spy.mockRestore();
  });

  it("uses a custom formatter via LoggerOptions", () => {
    const spy = vi.fn();
    class PrefixFormatter implements LogFormatter {
      format(entry: LogEntry): string {
        return `[${entry.level}] ${entry.message}`;
      }
    }
    const log = createLogger({
      level: "debug",
      formatter: new PrefixFormatter(),
      transport: { log: spy },
    });
    log.info("test");
    const output = spy.mock.calls[0]?.[0]?.message;
    expect(output).toBe("test");
  });
});

// ---------------------------------------------------------------------------
// 16. Public API surface
// ---------------------------------------------------------------------------
describe("public API", () => {
  it("exports createLogger", () => { expect(createLogger).toBeDefined(); });
  it("exports Logger", () => { expect(Logger).toBeDefined(); });
  it("exports ConsoleTransport", () => { expect(ConsoleTransport).toBeDefined(); });
  it("exports TextFormatter", () => { expect(TextFormatter).toBeDefined(); });
  it("exports JsonFormatter", () => { expect(JsonFormatter).toBeDefined(); });
  it("exports LEVELS", () => { expect(LEVELS).toBeDefined(); });
  it("exports getLevelPriority", () => { expect(getLevelPriority).toBeDefined(); });
  it("exports safeStringify", () => { expect(safeStringify).toBeDefined(); });
});
