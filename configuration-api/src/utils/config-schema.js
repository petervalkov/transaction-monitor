const Joi = require('joi');

module.exports.configuration = Joi.object({
    from: Joi.string()
        .pattern(new RegExp('^0x[a-fA-F0-9]{40}$'))
        .message('invalid from address'),

    to: Joi.string()
        .pattern(new RegExp('^0x[a-fA-F0-9]{40}$'))
        .message('invalid to address'),

    minValue: Joi.number()
        .integer()
        .min(0)
        .message('invalid min value'),

    maxValue: Joi.number()
        .integer()
        .min(0)
        .message('invalid max value'),

    type: Joi.number()
        .integer()
        .min(1)
        .max(3)
        .message('invalid type')

}).min(1).message('empty object');