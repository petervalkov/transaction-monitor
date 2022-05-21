const AppError = require('../utils/AppError');
const schema = require('../utils/config-schema');

module.exports = (type) => (req, res, next) => schema[type]
    .validateAsync(req.body)
    .then(next())
    .catch((err) => {
        if (err.isJoi) {
            next(new AppError(400, err.message));
        } else {
            next(err);
        }   
    });