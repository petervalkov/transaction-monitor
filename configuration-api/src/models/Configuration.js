const mongoose = require('mongoose');

const configurationSchema = mongoose.Schema(
    {
        from: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Configuration = mongoose.model('Configuration', configurationSchema);

module.exports = Configuration;