const Configuration = require('../models/Configuration');

const get = async (req, res) => {
    try {
        res.json(await Configuration.findById(req.params.id).exec());
    } catch (err) {
        res.send('error');
        console.log(err.message);
    }
};

const create = async (req, res) => {
    try {
        res.json(await Configuration.create(req.body));
    } catch (err) {
        res.send('error');
        console.log(err.message);
    }
};

module.exports = { get, create };