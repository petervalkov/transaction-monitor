/* eslint-disable no-unused-vars */
const dotenv = require('dotenv');
const awilix = require('awilix');
const Web3 = require('web3');
const express = require('express');

const Monitor = require('./Monitor');
const RuleEngine = require('./lib/RuleEngine');
const RuleService = require('./services/RuleService');
const MonitorController = require('./controllers/MonitorController');
const loggers = require('./utils/loggers');
const messages = require('./utils/messages');
const configRepo = require('./models/Config');
const transactionRepo = require('./models/Transaction');
const { createTransactionService, createConfigurationService } = require('./utils/factory');

dotenv.config();
const logger = loggers[process.env.ENVIRONMENT];

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
});

const transactionService = createTransactionService(transactionRepo);
const configurationService = createConfigurationService(configRepo);
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.ENDPOINT));

container.register({
    ruleOptions: awilix.asValue({ allowUndefinedFacts: true }),
    ruleEngine: awilix.asClass(RuleEngine).singleton(),
    rulesService: awilix.asClass(RuleService).singleton(),
    web3: awilix.asValue(web3),
    transactionService: awilix.asValue(transactionService),
    configurationService: awilix.asValue(configurationService),
    messages: awilix.asValue(messages),
    logger: awilix.asValue(logger),
    monitor: awilix.asClass(Monitor).singleton(),
    monitorController: awilix.asClass(MonitorController).scoped()
});

const monitor = new Monitor(container.cradle);
monitor.start();

const app = express();

app.use(express.json());

const router = express.Router();
router.post('/load', (req, res, next) => {
    const monitor = new MonitorController(req.container.cradle);
    return monitor.load(req, res, next);
});

app.use((req, res, next) => {
    req.container = container.createScope();
    return next();
});

app.use('/monitor', router);
app.all('*', (req, res, next) => {
    res.json({ status: 404, message: messages.error.notFound });
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

module.exports = app;