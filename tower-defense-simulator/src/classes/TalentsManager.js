import unitTalentsStore from '../data/UnitTalentsStore';

class TalentsManager {
    constructor(unitName, instanceTalents) {
        this.unitName = unitName;
        this.instanceTalents = instanceTalents || unitTalentsStore.getDefaultTalentState(unitName);
    }

    isTalentSelected(talentName) {
        return unitTalentsStore.isTalentSelected(this.unitName, talentName);
    }

    getInstanceTalentProperty(talentName, property) {
        return this.instanceTalents[talentName] && this.instanceTalents[talentName][property];
    }

    setInstanceTalentProperty(talentName, property, value) {
        if (!this.instanceTalents[talentName]) {
            this.instanceTalents[talentName] = {};
        }
        this.instanceTalents[talentName][property] = value;
    }

    // New method to get unit talents
    getUnitTalents() {
        return unitTalentsStore.getTalents(this.unitName);
    }
}

export default TalentsManager;
