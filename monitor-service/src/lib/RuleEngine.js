const { Engine, Rule } = require('json-rules-engine');

module.exports = class RuleEngine extends Engine {
    constructor({ruleOptions}){
        super([new Rule()], ruleOptions);
    }
};