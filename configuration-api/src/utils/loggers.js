const winston = require('winston');

module.exports.development = winston.createLogger({
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

module.exports.production = winston.createLogger({
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