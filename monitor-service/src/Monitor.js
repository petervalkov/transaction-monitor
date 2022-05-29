module.exports = class Monitor {
    constructor({blockchainService, rulesService, transactionService, configurationService, logger, messages}) {
        this.logger = logger;
        this.messages = messages;
        this.rulesService = rulesService;
        this.blockchainService = blockchainService;
        this.transactionService = transactionService;
        this.configurationService = configurationService;
    }

    start() {
        this.configurationService.findLatest()
            .then((res) => {
                if(res){
                    const configObj = JSON.parse(res.configuration);
                    this.logger.info(this.messages.info.configFound);
                    this.setRule.call(this, configObj, configObj._id);
                } else {
                    this.logger.info(this.messages.info.noConfig);
                }
            }).catch((err) => {
                this.logger.info(this.messages.info.noConfig);
            });
    }

    setRule(configRule, requester) {
        this.rulesService.setRule(configRule, requester);
        this.logger.info(this.messages.info.ruleLoaded, configRule);
        if(!this.subscription){
            this.subscribe();
        }
    }

    subscribe() {
        this.subscription = this.blockchainService.subscribe('newBlockHeaders')
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
        this.blockchainService.getBlock(data.number, true).then(block => {
            block?.transactions.forEach(trx => {
                this.rulesService.run(trx).then((res) => {
                    if (res.results.length > 0) {
                        this.transactionService.create(trx.hash, this.rulesService.getRuleRequester())
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
};