module.exports = class TransactionService {
    constructor({transactionRepo}){
        this.transactionRepo = transactionRepo;
    }

    create(hash, configuration) {
        return this.transactionRepo.create({ hash, configuration });
    }

    findByConfiguration(id){
        return this.transactionRepo.find({ configuration: id});
    }
};