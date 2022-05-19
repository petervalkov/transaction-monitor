const Web3 = require('web3');
const loggers = require('../utils/loggers');

const logger = loggers[process.env.ENVIRONMENT];
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.ENDPOINT));
let subscription;

const getBlock = (data) => {
    web3.eth.getBlock(data.number, true)
        .then(res => logger.info('Block ' + res.number));
        // .then(res => res.transactions.forEach(element => {
        //     logger.info(element.from);
        // }));
}

const load = (req, res, next) => {
    subscription = web3.eth.subscribe('newBlockHeaders')
        .on('connected', () => {
            logger.info('listening for blocks');
            res.send('configuration loaded');
        })
        .on('data', getBlock)
};

const unload = (req, res, next) => {
    subscription.unsubscribe(() => {
        logger.info('unsubscribed');
        res.send('configuration unloaded');
    });
};

module.exports = { load, unload };