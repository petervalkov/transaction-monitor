module.exports.createTransactionService = function(transactionRepo){
    return {
        create: (hash, config) => transactionRepo.create({ hash, config })
    };
};
module.exports.createConfigurationService = function(configRepo){
    return {
        create: (configuration, requestedBy) => configRepo.create({ configuration, requestedBy }),
        findLatest: () => configRepo.findOne({}, {}, {sort:{$natural:-1}})
    };
};