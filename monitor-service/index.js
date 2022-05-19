const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const loggers = require('./src/utils/loggers');
const routes = require('./src/routes');

const logger = loggers[process.env.ENVIRONMENT];

const app = express();

app.use(express.json());

app.use('/monitor', routes);

app.listen(process.env.PORT, () => {
    logger.info('listening on ' + process.env.PORT);
});

process.on('uncaughtException', (err) => {
    logger.info(err.message);
});