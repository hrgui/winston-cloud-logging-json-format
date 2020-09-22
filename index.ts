const winston = require("winston");
const { printf } = winston.format;
const jsonStringify = require("safe-stable-stringify");

export interface StackdriverData {
  serviceContext?;
  message?: string;
  metadata?;
}

// Map of Stackdriver logging levels.
const WINSTON_TO_STACKDRIVER: Map<string, string> = new Map([
  // npm log levels from https://www.npmjs.com/package/winston#logging-levels => https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
  ["error", "ERROR"],
  ["warn", "WARNING"],
  ["info", "INFO"],
  ["http", "INFO"],
  ["verbose", "DEBUG"],
  ["debug", "DEBUG"],
  ["silly", "SILLY"],
  // additional log levels from RFC5424
  ["emerg", "EMERGENCY"],
  ["crit", "CRITICAL"],
  ["notice", "NOTICE"],
]);

export const LOGGING_TRACE_KEY = "logging.googleapis.com/trace";

export const CloudLoggingFormat = printf(
  ({
    level,
    message,
    metadata = {},
    resource,
  }: {
    level;
    message;
    [name: string]: any;
  }) => {
    message = message || "";
    const data: StackdriverData = {};

    if (metadata.stack) {
      message += (message ? " " : "") + metadata.stack;
    }

    data.message = message;

    const entryMetadata: any = {
      resource,
      severity: WINSTON_TO_STACKDRIVER.get(level) || "DEFAULT",
    };

    if (metadata.logName) {
      entryMetadata.logName = metadata.logName;
    }

    if (metadata.httpRequest) {
      entryMetadata.httpRequest = metadata.httpRequest;
    }

    if (metadata.timestamp instanceof Date) {
      entryMetadata.timestamp = metadata.timestamp;
    }

    if (metadata.labels) {
      entryMetadata.labels = metadata.labels;
    }

    const trace = metadata[LOGGING_TRACE_KEY];
    if (trace) {
      entryMetadata.trace = trace as string;
    }

    return jsonStringify({ ...data, ...entryMetadata });
  }
);

module.exports = CloudLoggingFormat;
export default CloudLoggingFormat;
