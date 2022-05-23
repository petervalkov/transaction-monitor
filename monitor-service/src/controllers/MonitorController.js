module.exports = class MonitorController {
    constructor({ monitor, logger, configurationService, messages }) {
        this.logger = logger;
        this.monitor = monitor;
        this.configurationService = configurationService;
        this.messages = messages;
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
};