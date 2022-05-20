const Configuration = require('../models/Configuration');
const axios = require('axios');
const path = 'http://localhost:3000/monitor/load'; //TMP

module.exports.find = (req, res, next) => Configuration
    .findOne({ _id: req.params.id })
    .then((data) => {
        if (!data) {
            throw new Error('not found');
        }
        res.json(data);
    })
    .catch((err) => next(err));

module.exports.findAll = (req, res, next) => Configuration
    .find({})
    .then((data) => {
        res.json(data);
    })
    .catch((err) => next(err));

module.exports.create = (req, res, next) => Configuration
    .create(req.body)
    .then((configuration) => {
        axios.post(path, configuration)
            .then((mRes) => {
                const message = mRes.data.message;
                res.json({ configuration, message });
            })
            .catch((err) => {
                res.json({ configuration, message: 'monitor not responding' });
                next(err);
            });
    })
    .catch((err) => next(err));

module.exports.update = (req, res, next) => Configuration
    .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((config) => {
        if (!config) {
            throw new Error('not found');
        }
        res.json(config);
    })
    .catch((err) => next(err));

module.exports.remove = (req, res, next) => Configuration
    .findOneAndDelete({ _id: req.params.id })
    .then((config) => {
        if (!config) {
            throw new Error('not found');
        }
        res.json(config);
    })
    .catch((err) => next(err));