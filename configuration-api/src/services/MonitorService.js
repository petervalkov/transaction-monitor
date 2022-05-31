module.exports = class MonitorService {
    constructor({ httpClient, monitorAddress }) {
        this.httpClient = httpClient;
        this.monitorAddress = monitorAddress;
    }

    load(configuration) {
        return this.httpClient.post(this.monitorAddress, configuration);
    }

    getConfigurations(id){
        return this.httpClient.get(`${this.monitorAddress}/config/${id}`);
    }

    getTransactions(id){
        return this.httpClient.get(`${this.monitorAddress}/trx/${id}`);
    }
};