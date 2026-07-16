const CIRCULAR = "[Circircular]";

function getSerializer(): (this: unknown, _key: string, value: unknown) => unknown {
  const seen = new WeakSet<object>();

  return function replacer(_key: string, value: unknown): unknown {
    if (typeof value === "bigint") {
      return String(value);
    }

    if (value instanceof Error) {
      const serialized: Record<string, unknown> = {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
      if (value.cause !== undefined) {
        serialized.cause = value.cause;
      }
      if ("code" in value && typeof (value as Record<string, unknown>).code === "string") {
        serialized.code = (value as Record<string, unknown>).code;
      }
      return serialized;
    }

    if (value !== null && typeof value === "object") {
      if (seen.has(value)) {
        return CIRCULAR;
      }
      seen.add(value);
    }

    return value;
  };
}

export function safeStringify(value: unknown, space?: number): string {
  return JSON.stringify(value, getSerializer(), space) ?? String(value);
}
