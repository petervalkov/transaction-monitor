/* eslint-disable no-unused-vars */
module.exports = class MonitorController {
    constructor({ configService, monitorService, logger, messages }) {
        this.configService = configService;
        this.monitorService = monitorService;
        this.logger = logger;
        this.messages = messages;
    }

    load(req, res, next) {
        this.configService.find(req.params.id)
            .then((data) => {
                if (data.length === 0) {
                    res.json({ status: 404, message: this.messages.error.notFound });
                } else {
                    this.monitorService.load(data)
                        .then((mRes) => {
                            res.json({ status: 200, message: mRes.data.message, data });
                        })
                        .catch(() => {
                            res.json({ message: this.messages.error.monitorError, data });
                            this.logger.warn(this.messages.error.monitorError);
                        });
                }
            }).catch(err => {
                res.json({ status: 404, message: this.messages.error.notFound });
                this.logger.error({ private: true, level: 'error', message: err.stack });
            });
    }

    getConfigurations(req, res, next) {
        this.monitorService.getConfigurations(req.params.id)
            .then((rsp) => {
                res.json(rsp.data);
            }).catch(err => {
                res.json({ status: 404, message: this.messages.error.notFound });
                this.logger.error({ private: true, level: 'error', message: err.stack });
            });
    }

    getTransactions(req, res, next) {
        this.monitorService.getTransactions(req.params.id)
            .then((rsp) => {
                res.json(rsp.data);
            }).catch(err => {
                res.json({ status: 404, message: this.messages.error.notFound });
                this.logger.error({ private: true, level: 'error', message: err.stack });
            });
    }
};