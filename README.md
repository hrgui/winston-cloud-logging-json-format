# @hrgui/winston-cloud-logging-json-format

Returns a winston formatter that formats it as per Google Cloud Logging LogEntry. https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity

# Usage

```
npm install @hrgui/winston-cloud-logging-json-format
```

```js
const winston = require("winston");
const CloudLoggingFormat = require("@hrgui/winston-cloud-logging-json-format");

const logger = winston.createLogger({
  level: "debug",
  format: CloudLoggingFormat(),
  transports: [new winston.transports.Console()],
});

logger.error("error");
logger.warn("warn");
logger.info("info");
logger.http("http");
logger.verbose("verbose");
logger.debug("debug");
logger.silly("silly");
```

Support for multiple formatters:

```js
const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    CloudLoggingFormat()
  ),
  transports: [new winston.transports.Console()],
});

logger.error("error");
logger.warn("warn");
logger.info("info");
logger.http("http");
logger.verbose("verbose");
logger.debug("debug");
logger.silly("silly");
```

# What's the difference between @google-cloud/winston and this?

- This is just a formatter, not a transport. It formats the output. It's up to the transport on how this gets transferred.
- This is not a official Google package - [@google-cloud/logging-winston](https://www.npmjs.com/package/@google-cloud/logging-winston) is.

# Credits

printf inspired by https://www.npmjs.com/package/@google-cloud/logging-winston's Transport, but it does not make use of `@google-cloud/logging`. It is up to the user to provide those details.
