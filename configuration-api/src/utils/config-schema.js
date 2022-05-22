const Joi = require('joi');
const messages = require('./messages');

module.exports.configuration = Joi.object({
    from: Joi.string()
        .pattern(new RegExp('^0x[a-fA-F0-9]{40}$'))
        .message(messages.error.invalidFrom),

    to: Joi.string()
        .pattern(new RegExp('^0x[a-fA-F0-9]{40}$'))
        .message(messages.error.invalidTo),

    minValue: Joi.number()
        .integer()
        .min(0),

    maxValue: Joi.number()
        .integer()
        .min(0),

    type: Joi.number()
        .integer()
        .min(1)
        .max(3)
        .message(messages.error.invalidType)

}).min(1).message(messages.error.emptyObject);