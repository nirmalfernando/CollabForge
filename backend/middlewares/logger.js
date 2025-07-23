import { createLogger, format, transports } from "winston";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define custom Log format
const { combine, timestamp, label, printf, errors } = format;
const logFormat = printf(({ level, message, label, timestamp, stack }) => {
  return `${timestamp} [${label}] ${level}: ${stack || message}`;
});

// Create a logger instance
const logger = createLogger({
  format: combine(
    label({ label: "CollabForge" }),
    timestamp(),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Log errors to a file
    new transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    }),
    // Log all other information and above logs to another file
    new transports.File({
      filename: path.join(__dirname, "../logs/combined.log"),
    }),
  ],
});

// If we are not in production then log to the console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export default logger;
