const Configuration = require('../models/Configuration');

const find = (req, res, next) => Configuration
    .findOne({ _id: req.params.id })
    .then((data) => {
        if (!data) {
            throw new Error('not found');
        }
        res.json(data);
    })
    .catch((err) => next(err));

const findAll = (req, res, next) => Configuration
    .find({})
    .then((data) => {
        res.json(data);
    })
    .catch((err) => next(err));

const create = (req, res, next) => Configuration
    .create(req.body)
    .then((config) => res.json(config))
    .catch((err) => next(err));

const update = (req, res, next) => Configuration
    .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((config) => {
        if (!config) {
            throw new Error('not found');
        }
        res.json(config);
    })
    .catch((err) => next(err));

const remove = (req, res, next) => Configuration
    .findOneAndDelete({ _id: req.params.id })
    .then((config) => {
        if (!config) {
            throw new Error('not found');
        }
        res.json(config);
    })
    .catch((err) => next(err));

module.exports = { find, findAll, create, update, remove };