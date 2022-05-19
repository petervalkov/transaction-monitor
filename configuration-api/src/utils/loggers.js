const winston = require('winston');

const development = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ],
});

const production = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            level: 'info',
            format: winston.format.json(),
            filename: 'configuration.log'
        })
    ],
});

module.exports = {development, production};