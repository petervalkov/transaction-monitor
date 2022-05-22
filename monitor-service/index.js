const dotenv = require('dotenv');
const awilix = require('awilix');
const express = require('express');
const Web3 = require('web3');
const { Engine, Rule } = require('json-rules-engine');
const loggers = require('./src/utils/loggers');
const Monitor = require('./src/Monitor');
const MonitorController = require('./src/controllers/MonitorController');
const mongoose = require('mongoose');
const { getTransactionService, getConfigurationService } = require('./src/services');

dotenv.config();
const logger = loggers[process.env.ENVIRONMENT];

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
})

//Temp db
mongoose.connect(process.env.DB_CONNECTION).then(() => {
    logger.info('connected to db');
});

//SETUP MONITOR
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.ENDPOINT));
const rulesEngine = new Engine([new Rule()], { allowUndefinedFacts: true });
const transactionService = getTransactionService();
const configurationService = getConfigurationService();
const monitor = new Monitor(web3, rulesEngine, transactionService, configurationService, logger);
monitor.start();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.container = container.createScope()
    req.container.register({
        mntr: awilix.asValue(monitor) //REMOVE
    })
    return next()
});

const router = express.Router();
router.post('/load', (req, res, next) => {
    const monitor = new MonitorController(req.container.cradle)
    return monitor.load(req, res, next)
});

app.use('/monitor', router);
app.all('*', (req, res, next) => {
    res.json({ status: 404, message: 'not found' });
});

container.register({
    configurationService: awilix.asFunction(getConfigurationService),
    logger: awilix.asValue(logger),
    monitor: awilix.asValue(monitor),
    monitorController: awilix.asClass(MonitorController).scoped()
});

app.listen(process.env.PORT, () => {
    logger.info('listening on ' + process.env.PORT);
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