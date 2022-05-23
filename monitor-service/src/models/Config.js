const mongoose = require('mongoose');

const configSchema = mongoose.Schema(
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

module.exports = mongoose.model('Config', configSchema);