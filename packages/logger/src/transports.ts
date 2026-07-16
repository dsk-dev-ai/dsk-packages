import type { LogEntry, LoggerTransport, LogFormatter } from "./types.js";
import { TextFormatter } from "./formatters.js";

export interface ConsoleTransportOptions {
  formatter?: LogFormatter;
  colors?: boolean;
}

export class ConsoleTransport implements LoggerTransport {
  private readonly formatter: LogFormatter;

  constructor()
  constructor(useColors: boolean)
  constructor(options: ConsoleTransportOptions)
  constructor(useColorsOrOptions?: boolean | ConsoleTransportOptions) {
    if (useColorsOrOptions === undefined) {
      this.formatter = new TextFormatter();
    } else if (typeof useColorsOrOptions === "boolean") {
      this.formatter = new TextFormatter({ colors: useColorsOrOptions });
    } else {
      this.formatter = useColorsOrOptions.formatter ?? new TextFormatter({
        colors: useColorsOrOptions.colors,
      });
    }
  }

  log(entry: LogEntry): void {
    const output = this.formatter.format(entry);

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
      default:
        console.debug(output);
        break;
    }
  }
}
