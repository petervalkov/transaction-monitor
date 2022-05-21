const mongoose = require('mongoose');

const configurationSchema = mongoose.Schema(
    {
        from: {
            type: String,
            required: false,
        },
        to: {
            type: String,
            required: false,
        },
        minValue: {
            type: Number,
            required: false,
        },
        maxValue: {
            type: Number,
            required: false,
        },
        type: {
            type: Number,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Configuration = mongoose.model('Configuration', configurationSchema);

module.exports = Configuration;