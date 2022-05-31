module.exports = class ConfigurationService {
    constructor({configurationRepo}){
        this.configurationRepo = configurationRepo;
    }

    create(configuration, requestedBy) {
        return this.configurationRepo.create({ configuration, requestedBy });
    }

    findLatest() {
        return this.configurationRepo.findOne({}, {}, {sort:{$natural:-1}});
    }

    findByRequester(id) {
        return this.configurationRepo.find({ requestedBy: id });
    }

    findAll() {
        return this.configurationRepo.find();
    }
};