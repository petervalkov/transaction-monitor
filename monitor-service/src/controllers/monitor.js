const loggers = require('../utils/loggers');
const logger = loggers[process.env.ENVIRONMENT];
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.ENDPOINT));
const { Engine, Rule } = require('json-rules-engine');

const rule = new Rule();
const engine = new Engine([rule], { allowUndefinedFacts: true });
    // .on('success', (e, a, r) => {})
    // .on('failure', (e, a, r) => {})

let subscription;

getBlock = (data) => {
    web3.eth.getBlock(data.number, true)
        .then(block => block.transactions.forEach(trx => {
            engine.run(trx)
                .then((res) => {
                    if(res.results.length > 0){
                        logger.info('storing ' + trx.hash);
                    }
                });
        }));
}

module.exports.load = (req, res, next) => {
    if(subscription !== undefined){ //TEMP
        subscription.unsubscribe();
    }
    
    subscription = web3.eth.subscribe('newBlockHeaders') //MOVE SUBSCRIBE!!!
        .on('connected', () => {
            rule.setConditions({ all: parseConfiguration(req.body)});
            engine.updateRule(rule);
            logger.info('started monitoring configuration ' + req.body._id);
            res.json({ message: 'configuration loaded' });
        })
        .on('data', getBlock)
        .on('error', (err) => {
            res.json({ message: 'configuration not loaded' });
            next(err);
        })
};

module.exports.unload = (req, res, next) => {
    subscription.unsubscribe(() => {
        logger.info('unsubscribed');
        res.send('configuration unloaded');
    });
};

const operators = { from: 'equal', to: 'equal', amount: 'equal' };
function parseConfiguration(configuration) {
    return Object.entries(configuration)
        .filter(([fact, value]) => operators[fact] !== undefined)
        .map(([fact, value]) => {
            const operator = operators[fact];
            return { fact, operator, value }
        });
}