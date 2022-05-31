/* eslint-disable no-unused-vars */
const awilix = require('awilix');
const dotenv = require('dotenv');
const express = require('express');
const httpClient = require('axios');
dotenv.config();

const AppError = require('./utils/AppError');
const configService = require('./services/ConfigurationService');
const monitorService = require('./services/MonitorService');
const MonitorController = require('./controllers/MonitorController');
const ConfigurationController = require('./controllers/ConfigurationController');
const configRepo = require('./models/Configuration');
const loggers = require('./utils/loggers');
const messages = require('./utils/messages');
const inputValidator = require('./middlewares/input-validator');

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

const configRouter = express.Router();
configRouter.post('/', inputValidator('configuration'), (req, res, next) => new ConfigurationController(req.container.cradle).create(req, res, next));
configRouter.patch('/:id', inputValidator('configuration'), (req, res, next) => new ConfigurationController(req.container.cradle).update(req, res, next));
configRouter.delete('/:id', (req, res, next) => new ConfigurationController(req.container.cradle).remove(req, res, next));
configRouter.get('/:id', (req, res, next) => new ConfigurationController(req.container.cradle).find(req, res, next));
configRouter.get('/', (req, res, next) => new ConfigurationController(req.container.cradle).findAll(req, res, next));

const monitorRouter = express.Router();
monitorRouter.post('/:id', (req, res, next) => new MonitorController(req.container.cradle).load(req, res, next));
monitorRouter.get('/config/:id', (req, res, next) => new MonitorController(req.container.cradle).getConfigurations(req, res, next));
monitorRouter.get('/trx/:id', (req, res, next) => new MonitorController(req.container.cradle).getTransactions(req, res, next));

app.use('/config', configRouter);
app.use('/monitor', monitorRouter);

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
    logger: awilix.asValue(logger),
    messages: awilix.asValue(messages),
    monitorAddress: awilix.asValue(process.env.MONITOR_ADDRESS),
    httpClient: awilix.asValue(httpClient),
    configRepo: awilix.asValue(configRepo),
    configService: awilix.asClass(configService),
    monitorService: awilix.asClass(monitorService),
});

module.exports = app;