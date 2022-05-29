module.exports = class TransactionService {
    constructor({transactionRepo}){
        this.transactionRepo = transactionRepo;
    }

    create(hash, config) {
        return this.transactionRepo.create({ hash, config });
    }
};