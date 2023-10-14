import BaseUnit from './BaseUnit';
import DamageValues from './DamageValues';

class DPSUnit extends BaseUnit {

    static aoeRadius = 75;
    
    constructor(config) {
        super(config);
        this.baseSpeed = config.baseSpeed || this.constructor.baseSpeed || 0;
        this.baseDamage = config.baseDamage || this.constructor.baseDamage || 0;
        this.baseCritChance = config.baseCritChance || this.constructor.baseCritChance || 0;
        this.baseCritDamage = config.baseCritDamage || this.constructor.baseCritDamage || 0;
    }
    static sumOfArray(arr) {
        return arr.reduce((acc, curr) => acc + curr, 0);
    }

    getTotalBuffByType(type) {
        return DPSUnit.sumOfArray(this.buffs.filter(buff => buff.type === type).map(buff => buff.value));
    }

    totalSpeedBuff() {
        return this.getTotalBuffByType("speed");
    }

    totalDamageBuff() {
        return this.getTotalBuffByType("damage");
    }

    totalArmorBuff() {
        return this.getTotalBuffByType("armor-damage");
    }

    totalCritBuff() {
        return this.getTotalBuffByType("crit-chance");
    }

    totalCritDmgBuff() {
        return this.getTotalBuffByType("crit-damage");
    }

    computeAttackSpeed(baseSpeed) {
        const speed = baseSpeed / (1 + (this.totalSpeedBuff() / 100));
        return speed;
    }

    computeAttackDamage(baseDamage) {
        const damage = Math.round(baseDamage * (1 + (this.totalDamageBuff() / 100))) * (1 + (this.totalArmorBuff() / 100));
        return damage;
    }

    baseCalculateDPS(boardConfig, baseSpeed = this.baseSpeed, baseDamage = this.baseDamage, baseCritChance = this.baseCritChance, baseCritDamage = this.baseCritDamage) {
        const newAttackSpeed = this.computeAttackSpeed(baseSpeed);
        const newAttackDamage = this.computeAttackDamage(baseDamage);
        const totalCritChance = Math.min(1, DPSUnit.playerBaseCritChance + (baseCritChance / 100) + (this.totalCritBuff() / 100));
        const totalCritDmgBuff = this.totalCritDmgBuff() + baseCritDamage;

        const hitsPerSecond = 1 / newAttackSpeed;
        const critHitsPerSecond = hitsPerSecond * totalCritChance;
        const criticalDamage = Math.floor(newAttackDamage * ((boardConfig.playerCrit * (1 + (totalCritDmgBuff / 100))) + totalCritDmgBuff) / 100);

        const critDmgPerSecond = Math.floor(criticalDamage * critHitsPerSecond);
        const dmgPerSecond = newAttackDamage / newAttackSpeed;

        return new DamageValues(
            Math.floor(dmgPerSecond + critDmgPerSecond),
            newAttackDamage,
            newAttackSpeed,
            dmgPerSecond,
            critDmgPerSecond,
            hitsPerSecond,
            critHitsPerSecond,
            criticalDamage,
            totalCritChance
        );
    }

    calculateDPS(boardConfig) {
        return this.baseCalculateDPS(boardConfig);
    }

    toObject() {
        const baseObject = super.toObject();
        return {
            ...baseObject,
            baseSpeed: this.baseSpeed,
            baseDamage: this.baseDamage,
            baseCritChance: this.baseCritChance,
            baseCritDamage: this.baseCritDamage,
        };
    }
}

export default DPSUnit;
