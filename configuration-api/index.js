const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes');
const loggers = require('./src/utils/loggers');

dotenv.config();

const app = express();
const logger = loggers[process.env.ENVIRONMENT];

app.use(express.json());

app.use('/config', routes);

mongoose.connect(process.env.DB_CONNECTION).then(() => {
    logger.info('connected to db');
    app.listen(process.env.PORT, () => {
        logger.info('listening on ' + process.env.PORT);
    });
});

process.on('uncaughtException', (err) => {
    logger.info(err.message);
});