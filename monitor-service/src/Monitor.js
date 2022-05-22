module.exports = class Monitor {
    constructor(web3, engine, transactionService, configurationService, logger) {
        this.web3 = web3;
        this.engine = engine;
        this.rule = engine.rules[0];
        this.logger = logger;
        this.transactionService = transactionService;
        this.configurationService = configurationService;
        this.operators = { from: 'equal', to: 'equal', amount: 'equal' };
    }

    start() {
        this.configurationService
            .findOne({}, {}, { sort: { 'created_at' : -1 } })
            .then((res) => {
                if(res){
                    const configObj = JSON.parse(res.configuration);
                    this.logger.info('configuration found ' + res.configuration);
                    this.setRule(configObj, configObj._id);
                } else {
                    this.logger.info('no configuration found. waiting for request...');
                }
            }).catch((err) => {
                this.logger.info('no configuration found. waiting for request...');
                throw err
            });
    }

    setRule(configRule, requester) {
        this.rule.setConditions({ all: this.parseConfiguration(configRule) });
        this.rule.requester = requester;
        this.engine.updateRule(this.rule);
        this.logger.info('configuration rule loaded from requester: ' + this.rule.requester);
        if(!this.subscription){
            this.subscribe();
        }
    }

    subscribe() {
        this.subscription = this.web3.eth.subscribe('newBlockHeaders')
            .on('connected', () => {
                this.logger.info('listening for blocks');
            })
            .on('data', (data) => this.getBlock(data))
            .on('error', (err) => {
                this.logger.info('failed to connect to eth');
            })
    }

    getBlock(data) {
        this.logger.info('checking block ' + data.number);
        this.web3.eth.getBlock(data.number, true)
            .then(block => block?.transactions.forEach(trx => {
                this.engine.run(trx).then((res) => {
                    if (res.results.length > 0) {
                        this.transactionService
                            .create({
                                hash: trx.hash,
                                configuration: this.engine.rules[0].requester
                            }).then((trans) => {
                                this.logger.info('stored transaction ' + trans.hash);
                            }).catch((err) => {
                                this.logger.info('failed to store transaction ' + trx.hash);
                                next(err)
                            });
                    }
                });
            }));
    }

    //MOVE
    parseConfiguration(configuration) {
        return Object.entries(configuration)
            .filter(([fact, value]) => this.operators[fact] !== undefined)
            .map(([fact, value]) => {
                const operator = this.operators[fact];
                return { fact, operator, value }
            });
    }
}