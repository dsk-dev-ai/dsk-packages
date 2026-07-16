import { describe, it, expect } from "vitest";
import type { LoggerOptions, LogLevel } from "../src/index.js";

describe("logger", () => {
  it("should export LoggerOptions type", () => {
    const options: LoggerOptions = { level: "info" };
    expect(options.level).toBe("info");
  });

  it("should export LogLevel type", () => {
    const level: LogLevel = "debug";
    expect(level).toBe("debug");
  });
});
