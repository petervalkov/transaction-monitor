const Configuration = require('../models/Configuration');
const logger = require('../utils/loggers');

module.exports.get = async (req, res) => {
    try {
        res.json(await Configuration.findById(req.params.id).exec());
    } catch (err) {
        logger.info('neshto stana');
        res.send('error');
        //console.log(err.message);
    }
};

module.exports.getAll = (req, res, next) => Configuration
    .findOne({_id: req.params.id})
    .then((data) => {
        res.json(data);
    })
    .catch((err) => next(err));

module.exports.create = async (req, res) => {
    try {
        res.json(await Configuration.create(req.body));
    } catch (err) {
        res.send('error');
        console.log(err.message);
    }
};

module.exports.update = async (req, res) => {
    try {
        const config = await Configuration
            .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .exec();

        if (!config) {
            throw new Error('invalid id');
        }
        res.json(config);
    } catch (err) {
        res.send('error');
    }
};

module.exports.update2 = (req, res, next) => Configuration
    .findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((config) => {
        if (!config) {
            throw new Error('not found');
        }
        res.json(config);
    })
    .catch((err) => {
        next(err);
    });

module.exports.remove = (req, res, next) => Configuration
    .findOneAndDelete({ _id: req.params.id })
    .then((config) => {
        if (!config) {
            throw new Error('not found');
        }
        res.json(config);
    })
    .catch((err) => next(err));

//module.exports = { get, create, update, update2, remove };