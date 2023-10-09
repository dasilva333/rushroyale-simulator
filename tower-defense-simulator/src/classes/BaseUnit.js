import DamageValues from './DamageValues';
import { tiers, levels } from '../data/unitsService';

let unitCounter = 0;
class BaseUnit {
    static defaultImage = "";
    static playerBaseCritChance = 0.05; // Assuming it's global across all units
    static tiers = tiers;
    static levels = levels;

    constructor(config, x, y) {
        this.id = unitCounter++;
        this.name = config.name;
        this.baseSpeed = config.baseSpeed || 0;
        this.baseDamage = config.baseDamage || 0;
        this.baseCritChance = config.baseCritChance || 0;
        this.baseCritDamage = config.baseCritDamage || 0;
        this.tier = config.tier || 7;
        this.level = config.level || 15;
        this.x = x || -1;
        this.y = y || -1;
        this.neighbors = config.neighbors || 0;
        this.buffs = config.buffs || [];
    }

    // Getter to construct the complete image path
    static get baseImage() {
        return `/rushroyale-simulator/board/${this.defaultImage}`;
    }

    // By default, units don't do any damage
    calculateDPS() {
        return new DamageValues(); // returns the default 0-filled damage report
    }

    calculateAltDPS() {
        return new DamageValues(); // returns the default 0-filled damage report
    }

    getUnitBuffs() {
        return 0;    
    }

    toObject() {
        return {
            id: this.id,
            name: this.name,
            baseSpeed: this.baseSpeed,
            baseDamage: this.baseDamage,
            baseCritChance: this.baseCritChance,
            baseCritDamage: this.baseCritDamage,
            neighbors: this.neighbors,
            buffs: this.buffs
        };
    }
}

export default BaseUnit;
