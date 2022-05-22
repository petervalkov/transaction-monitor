module.exports.createConfigService = ({ configRepo }) => {
    return {
        find: (id) => configRepo.find({ _id: id }),
        findAll: () => configRepo.find({}),
        create: (props) => configRepo.create(props),
        update: (id, props) => configRepo.findOneAndUpdate({ _id: id }, props, { new: true }),
        remove: (id) => configRepo.findOneAndDelete({ _id: id })
    };
};

module.exports.createMonitorService = ({ httpClient, monitorAddress }) => {
    return {
        load: (configuration) => httpClient.post(monitorAddress, configuration)
        //findAll: (configuration) => httpClient.post(monitorAddress, configuration)
    };
};