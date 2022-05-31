module.exports = class ConfigurationService {
    constructor({configRepo}){
        this.configRepo = configRepo;
    }
    
    find(id) {
        return this.configRepo.findOne({ _id: id });
    }

    findAll() {
        return this.configRepo.find({});
    }

    create(props) {
        return this.configRepo.create(props);
    }

    update(id, props) {
        return this.configRepo.findOneAndUpdate({ _id: id }, props, { new: true });
    }

    remove(id) {
        return this.configRepo.findOneAndDelete({ _id: id });
    }
};