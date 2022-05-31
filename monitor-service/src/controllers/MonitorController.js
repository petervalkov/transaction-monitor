module.exports = class MonitorController {
    constructor({ monitor, logger, configurationService, transactionService, messages }) {
        this.logger = logger;
        this.monitor = monitor;
        this.messages = messages;
        this.transactionService = transactionService;
        this.configurationService = configurationService;
    }

    load(req, res, next) {
        this.configurationService.create(JSON.stringify(req.body), req.body._id)
            .then((configuration) => {
                this.logger.info(this.messages.info.configCreated);
                this.monitor.setRule(req.body, configuration._id);
                res.json({ status: 200, message: this.messages.info.configCreated });
            }).catch((err) => {
                res.json({ status: 500, message: this.messages.error.laodFailed });
                next(err);
            });
    }

    getConfigurations(req, res, next) {
        this.configurationService.findByRequester(req.params.id)
            .then((data) => {
                const result = data.map(x => {
                    return {id: x._id, configuration: JSON.parse(x.configuration)};
                });
                res.json(result);
            }).catch((err) => {
                res.json({ status: 500, message: this.messages.error.internalError });
            });
    }

    getTransactions(req, res, next) {
        this.transactionService.findByConfiguration(req.params.id)
            .then((data) => {
                res.json(data);
            }).catch((err) => {
                res.json({ status: 500, message: this.messages.error.internalError });
            });
    }
};