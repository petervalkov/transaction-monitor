/* eslint-disable no-unused-vars */
const dotenv = require('dotenv');
const awilix = require('awilix');
const express = require('express');

const Monitor = require('./Monitor');
const RuleEngine = require('./lib/RuleEngine');
const RuleService = require('./services/RuleService');
const EthBlockchain = require('./lib/EthBlockchain');
const BlockchainService = require('./services/BlockchainService');
const MonitorController = require('./controllers/MonitorController');
const TransactionService = require('./services/TransactionService');
const ConfigurationService = require('./services/ConfigurationService');
const loggers = require('./utils/loggers');
const messages = require('./utils/messages');
const transactionRepo = require('./models/Transaction');
const configurationRepo = require('./models/Config');

dotenv.config();
const logger = loggers[process.env.ENVIRONMENT];

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
});

container.register({
    logger: awilix.asValue(logger),
    messages: awilix.asValue(messages),
    endpoint: awilix.asValue(process.env.ENDPOINT),
    blockchain: awilix.asClass(EthBlockchain).singleton(),
    blockchainService: awilix.asClass(BlockchainService).singleton(),
    ruleOptions: awilix.asValue({ allowUndefinedFacts: true }),
    ruleEngine: awilix.asClass(RuleEngine).singleton(),
    rulesService: awilix.asClass(RuleService).singleton(),
    transactionRepo: awilix.asValue(transactionRepo),
    transactionService: awilix.asClass(TransactionService),
    configurationRepo: awilix.asValue(configurationRepo),
    configurationService: awilix.asClass(ConfigurationService),
    monitorController: awilix.asClass(MonitorController).scoped()
});

const monitor = new Monitor(container.cradle);
monitor.start();

container.register({
    monitor: awilix.asValue(monitor),
});

const app = express();

app.use(express.json());

const router = express.Router();
router.post('/load', (req, res, next) => new MonitorController(req.container.cradle).load(req, res, next));
router.get('/load/config/:id', (req, res, next) => new MonitorController(req.container.cradle).getConfigurations(req, res, next));
router.get('/load/trx/:id', (req, res, next) => new MonitorController(req.container.cradle).getTransactions(req, res, next));

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