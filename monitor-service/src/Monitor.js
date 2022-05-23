module.exports = class Monitor {
    constructor(web3, engine, transactionService, configurationService, logger, messages) {
        this.web3 = web3;
        this.engine = engine;
        this.rule = engine.rules[0];
        this.logger = logger;
        this.transactionService = transactionService;
        this.configurationService = configurationService;
        this.messages = messages;
    }

    start() {
        this.configurationService.findLatest()
            .then((res) => {
                if(res){
                    const configObj = JSON.parse(res.configuration);
                    this.logger.info(this.messages.info.configFound);
                    this.setRule(configObj, configObj._id);
                } else {
                    this.logger.info(this.messages.info.noConfig);
                }
            }).catch((err) => {
                this.logger.info(this.messages.info.noConfig);
            });
    }

    setRule(configRule, requester) {
        this.rule.setConditions({ all: this.parseConfiguration(configRule) });
        this.rule.requester = requester;
        this.engine.updateRule(this.rule);
        this.logger.info(this.messages.info.ruleLoaded, configRule);
        if(!this.subscription){
            this.subscribe();
        }
    }

    subscribe() {
        this.subscription = this.web3.eth.subscribe('newBlockHeaders')
            .on('connected', () => {
                this.logger.info(this.messages.info.ethSuccess);
            })
            .on('data', (data) => this.getBlock(data))
            .on('error', (err) => {
                this.logger.error(this.messages.error.ethFailed);
            });
    }

    getBlock(data) {
        this.logger.info(this.messages.info.checking, data.number);
        this.web3.eth.getBlock(data.number, true).then(block => {
            block?.transactions.forEach(trx => {
                this.engine.run(trx).then((res) => {
                    if (res.results.length > 0) {
                        this.transactionService.create(trx.hash, this.engine.rules[0].requester)
                            .then((transaction) => {
                                this.logger.info(this.messages.info.trxFound, transaction.hash);
                            }).catch((err) => {
                                this.logger.error(this.messages.error.trxStoreFailed, trx.hash);
                                next(err);
                            });
                    }
                });
            });
        });
    }

    parseConfiguration(configuration) {
        const alias = {minValue: 'value', maxValue: 'value'};
        const operators = { 
            from: 'equal', 
            to: 'equal', 
            maxValue: 'lessThanInclusive', 
            minValue: 'greaterThanInclusive', 
            type: 'equal'
        };
        return Object.entries(configuration)
            .filter(([fact, value]) => operators[fact] !== undefined)
            .map(([fct, value]) => {
                const operator = operators[fct];
                const fact = alias[fct] ? alias[fct] : fct;
                return { fact, operator, value };
            });
    }
};