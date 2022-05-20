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
        amount: {
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