const Joi = require('joi');

const configSchema = Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    ammount: Joi.number(),
});

module.exports = { configSchema };