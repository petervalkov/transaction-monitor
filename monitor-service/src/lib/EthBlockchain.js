const Eth = require('web3-eth');

module.exports = class EthBlockchain extends Eth{
    constructor({endpoint}){
        super(endpoint);
    }
};