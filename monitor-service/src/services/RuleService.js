module.exports = class RuleService {
    constructor({ruleEngine}){
        this.engine = ruleEngine;
        this.rule = this.engine.rules[0];
    }

    run(transaction){
        return this.engine.run(transaction);
    }

    setRule(configRule, requester){
        this.rule.setConditions({ all: this.parseConfiguration(configRule) });
        this.rule.requester = requester;
        this.engine.updateRule(this.rule);
    }

    getRuleRequester(){
        return this.rule.requester;
    }

    parseConfiguration(configuration) {
        const alias = {minValue: 'value', maxValue: 'value'};
        const operators = { 
            from: 'equal', 
            to: 'equal', 
            maxValue: 'lessThanInclusive', 
            minValue: 'greaterThanInclusive', 
            type: 'equal'
        };
        return Object.entries(configuration)
            .filter(([fact, value]) => operators[fact] !== undefined)
            .map(([fct, value]) => {
                const operator = operators[fct];
                const fact = alias[fct] ? alias[fct] : fct;
                return { fact, operator, value };
            });
    }
};