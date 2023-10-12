import DPSUnit from './DPSUnit';

// New class DmgSteppedUnit
class DmgSteppedUnit extends DPSUnit {
  static damageIncreaseSteps = 0;

  calculateDPS(boardConfig) {
    // Initial calculations or any other logic specific to DmgSteppedUnit can be added here.
    return this.calculateSteppedDamage(boardConfig);
  }

  calculateSteppedDamage(damageInfo) {
    const totalPhaseParts = Math.ceil(this.damageIncrease / this.constructor.damageIncreaseSteps);
    damageInfo.totalPhaseLengthSeconds = totalPhaseParts * damageInfo.newAttackSpeed;

    let totalHitDamage = 0;
    let originalDamage = damageInfo.newAttackDamage;

    for (let i = 0; i < totalPhaseParts; i++) {
      const currentDmgIncrease = Math.min(this.damageIncrease, this.constructor.damageIncreaseSteps * (i + 1));
      const currentDamage = Math.floor(originalDamage * (1 + (currentDmgIncrease / 100)));
      totalHitDamage += currentDamage;
      damageInfo.maxHitDamage = currentDamage;
    }

    const totalCritChance = damageInfo.totalCritChance;
    const numberOfCrits = totalCritChance * totalPhaseParts;

    damageInfo.critDmgPerSecond = Math.floor((numberOfCrits * damageInfo.criticalDamage) / damageInfo.totalPhaseLengthSeconds);
    damageInfo.dmgPerSecond = Math.floor(totalHitDamage / damageInfo.totalPhaseLengthSeconds);
    damageInfo.total = damageInfo.dmgPerSecond + damageInfo.critDmgPerSecond;

    return damageInfo;
  }
}

export default DmgSteppedUnit;