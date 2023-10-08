class DamageValues {
    constructor(
        total = 0,
        newAttackDamage = 0,
        newAttackSpeed = 0,
        dmgPerSecond = 0,
        critDmgPerSecond = 0,
        hitsPerSecond = 0,
        critHitsPerSecond = 0,
        criticalDamage = 0,
        totalCritChance = 0
    ) {
        this.total = total;
        this.newAttackDamage = newAttackDamage;
        this.newAttackSpeed = newAttackSpeed;
        this.dmgPerSecond = dmgPerSecond;
        this.critDmgPerSecond = critDmgPerSecond;
        this.hitsPerSecond = hitsPerSecond;
        this.critHitsPerSecond = critHitsPerSecond;
        this.criticalDamage = criticalDamage;
        this.totalCritChance = totalCritChance;
    }
}

export default DamageValues;