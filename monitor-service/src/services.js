const mongoose = require('mongoose');
const transactionSchema = require('./models/Transaction')
const configurationSchema = require('./models/Config')

module.exports.getTransactionService = () => mongoose.model('Transaction', transactionSchema);
module.exports.getConfigurationService = () => mongoose.model('Config', configurationSchema);