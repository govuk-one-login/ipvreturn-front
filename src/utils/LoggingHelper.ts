import { createLogger, format, transports } from "winston";

export const loggingHelper = createLogger({
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.printf(({ timestamp, level, message, metadata }) => {
					if (JSON.stringify(metadata) !== "{}") {
						return `[${timestamp}] ${level}: ${message}. ${JSON.stringify(
							metadata,
						)}`;
					} else {
						return `[${timestamp}] ${level}: ${message}`;
					}

				}),
			),
		}),
	],
	format: format.combine(format.metadata(), format.timestamp()),
});
