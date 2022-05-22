module.exports = class MonitorController {
    constructor({ monitor, logger, configurationService }) {
        this.logger = logger;
        this.monitor = monitor;
        this.configurationService = configurationService;
    }

    load(req, res, next) {
        this.configurationService
            .create({
                configuration: JSON.stringify(req.body),
                requestedBy: req.body._id
            }).then((cnf) => {
                this.monitor.setRule(req.body, cnf._id);
                res.json({ message: 'configuration loaded in monitor' });
                this.logger.info('configuration loaded')
            }).catch((err) => {
                res.json({ message: 'configuration not loaded' });
                next(err);
            })
    };
}