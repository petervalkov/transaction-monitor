const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes');
const AppError = require('./src/utils/AppError');
const loggers = require('./src/utils/loggers');

const errorHandler = require('./src/middlewares/error-handler');

dotenv.config();

const logger = loggers[process.env.ENVIRONMENT];

const app = express();
app.use(express.json());
app.use('/config', routes);
app.all('*', (req, res, next) => {
    next(new AppError(404, 'not found'));
});

app.use(errorHandler);

mongoose.connect(process.env.DB_CONNECTION).then(() => {
    logger.info('connected to db');
    app.listen(process.env.PORT, () => {
        logger.info('listening on ' + process.env.PORT);
    });
});

process.on('uncaughtException', (err) => {
    logger.info(err.message);
});

process.on('SIGINT', closeApp);
process.on('SIGTERM', closeApp);

function closeApp() {
    mongoose.connection.close(() => {
        logger.info('db connection closed');
        process.exit(0);
        // app.close(() => {
        //     logger.info('server closed');
        // });
    });
}