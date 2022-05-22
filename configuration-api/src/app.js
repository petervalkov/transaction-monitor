/* eslint-disable no-unused-vars */
const express = require('express');
const dotenv = require('dotenv');
const httpClient = require('axios');
dotenv.config();

const ConfigurationController = require('./controllers/ConfigurationController');
const AppError = require('./utils/AppError');
const configRepo = require('./models/Configuration');
const inputValidator = require('./middlewares/input-validator');
const loggers = require('./utils/loggers');
const factory = require('./utils/factory');
const messages = require('./utils/messages');

const awilix = require('awilix');
const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
});

const logger = loggers[process.env.ENVIRONMENT];

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    req.container = container.createScope();
    return next();
});

const router = express.Router();

router.post('/', inputValidator('configuration'), (req, res, next) => new ConfigurationController(req.container.cradle).create(req, res, next));
router.patch('/:id', inputValidator('configuration'), (req, res, next) => new ConfigurationController(req.container.cradle).update(req, res, next));
router.delete('/:id', (req, res, next) => new ConfigurationController(req.container.cradle).remove(req, res, next));
router.get('/:id', (req, res, next) => new ConfigurationController(req.container.cradle).find(req, res, next));
router.get('/', (req, res, next) => new ConfigurationController(req.container.cradle).findAll(req, res, next));

app.use('/config', router);

app.all('*', (req, res, next) => {
    next(new AppError(404, messages.error.notFound));
});

app.use((err, req, res, next) => {
    logger.error({ private: true, level: 'error', message: err.stack });
    logger.error({ level: 'error', message: err.message });
    if (!err.internal) {
        const { status, message } = err;
        res.json({ status, message });
    } else {
        res.json({ status: 500, message: messages.error.internalError });
    }
});

container.register({
    messages: awilix.asValue(messages),
    logger: awilix.asValue(logger),
    monitorAddress: awilix.asValue(process.env.MONITOR_ADDRESS),
    httpClient: awilix.asValue(httpClient),
    configRepo: awilix.asValue(configRepo),
    monitorService: awilix.asFunction(factory.createMonitorService),
    configService: awilix.asFunction(factory.createConfigService)
});

module.exports = app;