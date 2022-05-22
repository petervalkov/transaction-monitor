const mongoose = require('mongoose');

module.exports = mongoose.Schema(
    {
        configuration: {
            type: String,
            required: false,
        },
        requestedBy: {
            type: String,
            required: false,
        },
        transactions: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Transaction' 
            }
        ]
    },
    {
        timestamps: true,
    }
);