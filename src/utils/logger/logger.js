import { createLogger, format, transports } from "winston";
import { __dirname } from "../utils.js";

const { combine, printf, timestamp, colorize } = format;

const logConfig = {
    level: process.env.NODE_ENV === "prod" ? "info" : "debug",
    format: combine(
        timestamp({
            format: "MM-DD-YYYY HH:mm:ss",
        }),
        colorize(),
        printf(
            (info) => `${info.level} | ${[info.timestamp]} | ${info.message}`
        )
    ),
    transports: [
        new transports.Console(),
        process.env.NODE_ENV === "prod" &&
            new transports.File({
                filename: __dirname + "/logger/errors.log",
                level: "error",
            }),
    ].filter(Boolean),
};

export const logger = createLogger(logConfig);
