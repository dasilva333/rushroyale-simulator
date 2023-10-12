
class TalentedUnit extends BaseUnit {
    constructor(config) {
        super(config);
        this.talents = this.buildTalentTreeState(this.name);
    }

    static buildTalentTreeState(unitName) {
        const unitTalentData = availableTalents.find(t => t.name === unitName);
        if (!unitTalentData) return {};
        // ... logic to construct the state based on the talent data
    }
}
