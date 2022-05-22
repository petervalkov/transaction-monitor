/* eslint-disable no-unused-vars */
module.exports = class ConfigurationController {
    constructor({ configService, monitorService, logger, messages }) {
        this.configService = configService;
        this.monitorService = monitorService;
        this.logger = logger;
        this.messages = messages;
    }

    find(req, res, next) {
        this.configService.find(req.params.id)
            .then((data) => {
                if (data.length === 0) {
                    res.json({ status: 404, message: this.messages.error.notFound });
                } else {
                    res.json(data);
                }
            }).catch(err => {
                res.json({ status: 404, message: this.messages.error.notFound });
                this.logger.error({ private: true, level: 'error', message: err.stack });
            });
    }

    findAll(req, res, next) {
        this.configService.findAll()
            .then((data) => {
                res.json(data);
            }).catch(err => next(err));
    }

    create(req, res, next) {
        this.configService.create(req.body)
            .then((configuration) => {
                this.logger.info(this.messages.info.configCreated);
                this.monitorService.load(configuration)
                    .then((mRes) => {
                        res.json({ status: 200, message: mRes.data.message, configuration });
                    })
                    .catch(() => {
                        res.json({ message: this.messages.error.monitorError, configuration });
                        this.logger.warn(this.messages.error.monitorError);
                    });
            }).catch(err => next(err));
    }

    update(req, res, next) {
        this.configService.update(req.params.id, req.body)
            .then((configuration) => {
                if (!configuration) {
                    res.json({ status: 404, message: this.messages.error.notFound });
                } else {
                    res.json({ status: 200, message: this.messages.info.configUpdated, configuration });
                }
            }).catch(err => next(err));
    }

    remove(req, res, next) {
        this.configService.remove(req.params.id)
            .then((configuration) => {
                if (!configuration) {
                    res.json({ status: 404, message: this.messages.error.notFound });
                } else {
                    res.json({ status: 200, message: this.messages.info.configDeleted, configuration });
                }
            }).catch(err => next(err));
    }
};