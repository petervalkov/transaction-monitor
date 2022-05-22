const mongoose = require('mongoose');

module.exports = mongoose.Schema(
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