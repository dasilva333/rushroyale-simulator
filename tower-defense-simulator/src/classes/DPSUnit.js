import BaseUnit from './BaseUnit';
import DamageValues from './DamageValues';

class DPSUnit extends BaseUnit {

    static sumOfArray(arr) {
        return arr.reduce((acc, curr) => acc + curr, 0);
    }
    
    totalSpeedBuff() { return []; }
    totalDmgBuff() { return []; }
    totalArmorBuff() { return []; }
    totalCritBuff() { return []; }
    totalCritDmgBuff() { return []; }
    
    computeAttackSpeed(baseSpeed) {
        let speed = baseSpeed;
        for (let buff of this.totalSpeedBuff()) {
            speed = speed / (1 + (buff / 100));
        }
        return speed;
    }
    
    computeAttackDamage(baseDamage) {
        let damage = baseDamage;
        for (let buff of this.totalDmgBuff()) {
            damage = Math.round(damage * (1 + (buff / 100)));
        }
        damage = (damage * (1 + (DPSUnit.sumOfArray(this.totalArmorBuff()) / 100)));
        return damage;
    }
    baseCalculateDPS(boardConfig, baseSpeed = this.baseSpeed, baseDamage = this.baseDamage, baseCritChance = this.baseCritChance, baseCritDamage = this.baseCritDamage) {
        const newAttackSpeed = this.computeAttackSpeed(baseSpeed);
        const newAttackDamage = this.computeAttackDamage(baseDamage);
        
        const totalCritBuffPercent = Math.min(1, DPSUnit.playerBaseCritChance + (baseCritChance / 100) + (DPSUnit.sumOfArray(this.totalCritBuff()) / 100));
        
        const hitsPerSecond = 1 / newAttackSpeed;
        const critHitsPerSecond = hitsPerSecond * totalCritBuffPercent;
        
        let totalCritDmgBuff = DPSUnit.sumOfArray(this.totalCritDmgBuff()) + baseCritDamage;
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
            criticalDamage
        );
    }
    
    calculateDPS(boardConfig) {
        return this.baseCalculateDPS(boardConfig);
    }
}

export default DPSUnit;

