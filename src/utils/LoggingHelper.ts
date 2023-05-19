import {createLogger, format, transports} from "winston";

export const loggingHelper = createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(({ timestamp, level, message, metadata }) => {
                    return `[${timestamp}] ${level}: ${message}. ${JSON.stringify(
                        metadata
                    )}`;
                })
            ),
        })
    ],
    format: format.combine(format.metadata(), format.timestamp()),
});
