const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./src/app');
const loggers = require('./src/utils/loggers');
const messages = require('./src/utils/messages');

dotenv.config();
const logger = loggers[process.env.ENVIRONMENT];

let server;
mongoose.connect(process.env.DB_CONNECTION)
    .then(() => {
        logger.info(messages.info.dbSuccess);
        server = app.listen(process.env.PORT, () => {
            logger.log('info', messages.info.serverStarted, process.env.PORT);
        });
    })
    .catch((err) => {
        logger.error({ private: true, level: 'error', message: err.stack });
        logger.info(messages.error.dbFail);
    });

process.on('uncaughtException', (err) => {
    logger.error({ private: true, level: 'error', message: err.stack });
});

process.on('SIGINT', closeApp);
process.on('SIGTERM', closeApp);

function closeApp() {
    mongoose.connection.close(() => {
        logger.info(messages.info.dbClosed);
        server.close(() => {
            logger.info(messages.info.dbClosed);
            process.exit(0);
        });
    });
}