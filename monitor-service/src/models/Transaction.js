const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
    {
        hash: {
            type: String,
            required: false,
        },
        configuration: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Config' 
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);