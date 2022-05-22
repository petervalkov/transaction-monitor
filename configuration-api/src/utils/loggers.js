/* eslint-disable no-unused-vars */
const winston = require('winston');
const format = winston.format;
const { combine, splat, timestamp, simple, colorize, prettyPrint } = format;

const ignorePrivate = format((info, opts) => {
    if (info.private) { return false; }
    return info;
});

module.exports.development = winston.createLogger({
    level: 'debug',
    format: combine(
        colorize(),
        simple(),
        splat(),
        ignorePrivate()
    ),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                simple(),
                splat(),
            )
        })
    ],
});

module.exports.production = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'info.log',
            format: combine(
                format.json(),
                timestamp(),
            ),
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'error.log',
            format: combine(
                format.json(),
                timestamp(),
                prettyPrint()
            ),
        })
    ],
});