import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.colorize(),
    //format.timestamp({ format: "hh:mm:ss A" }),
    format.printf((info) => `${info.level}: ${info.message}`)
  ),
  transports: [new transports.Console()],
});
