module.exports = class BlockchainService {
    constructor({blockchain}){
        this.blockchain = blockchain;
    }

    subscribe(event){
        return this.blockchain.subscribe(event);
    }

    getBlock(blockNumber, includeTransactions){
        return this.blockchain.getBlock(blockNumber, includeTransactions);
    }
};