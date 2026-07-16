import { describe, it, expect, vi, beforeEach } from "vitest";
import { createLogger, Logger } from "../src/logger.js";
import { ConsoleTransport } from "../src/transports.js";
import type { LoggerTransport, LogEntry } from "../src/types.js";

describe("createLogger", () => {
  it("should create a Logger instance with default options", () => {
    const logger = createLogger();
    expect(logger).toBeInstanceOf(Logger);
  });

  it("should create a Logger instance with custom options", () => {
    const logger = createLogger({ level: "debug", prefix: "Test" });
    expect(logger).toBeInstanceOf(Logger);
  });
});

describe("Logger", () => {
  let transport: LoggerTransport;
  let logSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    logSpy = vi.fn();
    transport = { log: logSpy };
  });

  describe("level filtering", () => {
    it("should log messages at or above configured level", () => {
      const logger = createLogger({ level: "warn", transport });

      logger.debug("debug msg");
      logger.info("info msg");
      logger.warn("warn msg");
      logger.error("error msg");

      expect(logSpy).toHaveBeenCalledTimes(2);

      const calls = logSpy.mock.calls.map((c: [LogEntry]) => c[0].level);
      expect(calls).toEqual(["warn", "error"]);
    });

    it("should log all levels when level is debug", () => {
      const logger = createLogger({ level: "debug", transport });

      logger.debug("debug msg");
      logger.info("info msg");
      logger.warn("warn msg");
      logger.error("error msg");

      expect(logSpy).toHaveBeenCalledTimes(4);
    });

    it("should log nothing when level is higher than all messages", () => {
      const logger = createLogger({ level: "error", transport });

      logger.debug("debug msg");
      logger.info("info msg");
      logger.warn("warn msg");

      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe("message delivery", () => {
    it("should pass the correct log level", () => {
      const logger = createLogger({ level: "debug", transport });

      logger.warn("warning");

      expect(logSpy).toHaveBeenCalledWith(
        expect.objectContaining({ level: "warn", message: "warning" }),
      );
    });

    it("should pass the correct message content", () => {
      const logger = createLogger({ level: "debug", transport });

      logger.info("hello world");

      const entry = logSpy.mock.calls[0]?.[0] as LogEntry;
      expect(entry.message).toBe("hello world");
    });

    it("should support all log levels", () => {
      const logger = createLogger({ level: "debug", transport });

      logger.debug("d");
      logger.info("i");
      logger.warn("w");
      logger.error("e");

      const levels = logSpy.mock.calls.map((c: [LogEntry]) => c[0].level);
      expect(levels).toEqual(["debug", "info", "warn", "error"]);
    });
  });

  describe("prefix", () => {
    it("should include prefix in log entry when configured", () => {
      const logger = createLogger({ level: "debug", prefix: "API", transport });

      logger.info("msg");

      expect(logSpy).toHaveBeenCalledWith(
        expect.objectContaining({ prefix: "API" }),
      );
    });

    it("should not include prefix when not configured", () => {
      const logger = createLogger({ level: "debug", transport });

      logger.info("msg");

      const entry = logSpy.mock.calls[0]?.[0] as LogEntry;
      expect(entry.prefix).toBeUndefined();
    });
  });

  describe("timestamp", () => {
    it("should include a valid ISO timestamp by default", () => {
      const logger = createLogger({ level: "debug", transport });

      logger.info("msg");

      const entry = logSpy.mock.calls[0]?.[0] as LogEntry;
      expect(entry.timestamp).toBeTruthy();
      expect(() => new Date(entry.timestamp)).not.toThrow();
    });
  });

  describe("metadata", () => {
    it("should include metadata in log entry when provided", () => {
      const logger = createLogger({ level: "debug", transport });
      const meta = { userId: 123, role: "admin" };

      logger.info("msg", meta);

      expect(logSpy).toHaveBeenCalledWith(
        expect.objectContaining({ metadata: meta }),
      );
    });

    it("should omit metadata when not provided", () => {
      const logger = createLogger({ level: "debug", transport });

      logger.info("msg");

      const entry = logSpy.mock.calls[0]?.[0] as LogEntry;
      expect(entry.metadata).toBeUndefined();
    });

    it("should pass metadata through all log level methods", () => {
      const logger = createLogger({ level: "debug", transport });
      const meta = { key: "value" };

      logger.debug("d", meta);
      logger.info("i", meta);
      logger.warn("w", meta);
      logger.error("e", meta);

      for (const call of logSpy.mock.calls) {
        expect(call[0].metadata).toEqual(meta);
      }
    });
  });

  describe("error handling", () => {
    it("should convert Error object to string message", () => {
      const logger = createLogger({ level: "debug", transport });
      const error = new Error("Something failed");

      logger.error(error);

      const entry = logSpy.mock.calls[0]?.[0] as LogEntry;
      expect(entry.message).toContain("Something failed");
    });

    it("should accept string errors", () => {
      const logger = createLogger({ level: "debug", transport });

      logger.error("Something failed");

      const entry = logSpy.mock.calls[0]?.[0] as LogEntry;
      expect(entry.message).toBe("Something failed");
    });

    it("should include metadata alongside error", () => {
      const logger = createLogger({ level: "debug", transport });
      const error = new Error("DB error");

      logger.error(error, { db: "users" });

      const entry = logSpy.mock.calls[0]?.[0] as LogEntry;
      expect(entry.message).toContain("DB error");
      expect(entry.metadata).toEqual({ db: "users" });
    });
  });

  describe("custom transport", () => {
    it("should use the provided transport", () => {
      const customSpy = vi.fn();
      const customTransport: LoggerTransport = { log: customSpy };

      const logger = createLogger({ level: "debug", transport: customTransport });
      logger.info("msg");

      expect(customSpy).toHaveBeenCalledOnce();
    });

    it("should receive complete log entries", () => {
      const entries: LogEntry[] = [];
      const collectingTransport: LoggerTransport = {
        log: (entry) => { entries.push(entry); },
      };

      const logger = createLogger({
        level: "debug",
        prefix: "Svc",
        transport: collectingTransport,
      });

      logger.info("started", { port: 3000 });

      expect(entries).toHaveLength(1);
      expect(entries[0]?.level).toBe("info");
      expect(entries[0]?.message).toBe("started");
      expect(entries[0]?.prefix).toBe("Svc");
      expect(entries[0]?.metadata).toEqual({ port: 3000 });
      expect(entries[0]?.timestamp).toBeTruthy();
    });

    it("should support multiple log calls via custom transport", () => {
      const entries: LogEntry[] = [];
      const collectingTransport: LoggerTransport = {
        log: (entry) => { entries.push(entry); },
      };

      const logger = createLogger({ level: "debug", transport: collectingTransport });
      logger.info("one");
      logger.warn("two");
      logger.error("three");

      expect(entries).toHaveLength(3);
    });
  });

  describe("ConsoleTransport", () => {
    it("should call console.error for error level", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      const transport = new ConsoleTransport(false);
      transport.log({ level: "error", message: "err", timestamp: "2024-01-01" });
      expect(spy).toHaveBeenCalledOnce();
      spy.mockRestore();
    });

    it("should call console.warn for warn level", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const transport = new ConsoleTransport(false);
      transport.log({ level: "warn", message: "warn", timestamp: "2024-01-01" });
      expect(spy).toHaveBeenCalledOnce();
      spy.mockRestore();
    });

    it("should call console.info for info level", () => {
      const spy = vi.spyOn(console, "info").mockImplementation(() => {});
      const transport = new ConsoleTransport(false);
      transport.log({ level: "info", message: "info", timestamp: "2024-01-01" });
      expect(spy).toHaveBeenCalledOnce();
      spy.mockRestore();
    });

    it("should call console.debug for debug level", () => {
      const spy = vi.spyOn(console, "debug").mockImplementation(() => {});
      const transport = new ConsoleTransport(false);
      transport.log({ level: "debug", message: "dbg", timestamp: "2024-01-01" });
      expect(spy).toHaveBeenCalledOnce();
      spy.mockRestore();
    });
  });

  describe("public API exports", () => {
    it("should export createLogger function", () => {
      expect(createLogger).toBeDefined();
      expect(typeof createLogger).toBe("function");
    });

    it("should export Logger class", () => {
      expect(Logger).toBeDefined();
    });

    it("should export ConsoleTransport class", () => {
      expect(ConsoleTransport).toBeDefined();
    });
  });
});
