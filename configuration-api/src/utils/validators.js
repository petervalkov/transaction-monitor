const Joi = require('joi');

const configSchema = Joi.object({
    from: Joi.string(),
    to: Joi.string(),
    amount: Joi.number()
});

module.exports = { configSchema };