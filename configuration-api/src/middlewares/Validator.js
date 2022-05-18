const validators = require('../utils/validators');

module.exports = (validator) => async (req, res, next) => {
    try {
        req.body = await validators[validator].validateAsync(req.body);
    } catch (err) {
        if (!err.isJoi) {
            next(err);
        }
        res.send(err.message);
    }
};