import DamageValues from './DamageValues';
let unitCounter = 0;
class BaseUnit {
    static defaultImage = "";
    static playerBaseCritChance = 0.05; // Assuming it's global across all units

    constructor(config) {
        this.id = unitCounter++;
        this.name = config.name;
        this.baseSpeed = config.baseSpeed || 0;
        this.baseDamage = config.baseDamage || 0;
        this.baseCritChance = config.baseCritChance || 0;
        this.baseCritDamage = config.baseCritDamage || 0;
    }

    // Getter to construct the complete image path
    static get baseImage() {
        return `/rushroyale-simulator/board/${this.defaultImage}`;
    }

    // By default, units don't do any damage
    calculateDPS() {
        return new DamageValues(); // returns the default 0-filled damage report
    }

    toObject() {
        return {
            id: this.id,
            name: this.name,
            baseSpeed: this.baseSpeed,
            baseDamage: this.baseDamage,
            baseCritChance: this.baseCritChance,
            baseCritDamage: this.baseCritDamage
            // ... other properties you want to serialize
        };
    }
}

export default BaseUnit;
