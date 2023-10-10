import React from 'react';
import DPSUnit from '../../classes/DPSUnit';

class Inquisitor extends DPSUnit {
  static defaultImage = "inquisitor.png";
  static damageIncrease = 600;
  static damageIncreaseSteps = 15;
  static damageLevels = {
    7: 320,
    8: 338,
    9: 359,
    10: 383,
    11: 410,
    12: 442,
    13: 478,
    14: 520,
    15: 568
  };

  constructor(config) {
    super(config);
    this.absorbs = config.absorbs || 1;
    this.damageIncrease = config.damageIncrease || 15; // This is a magic number for now, adjust as needed
    this.component = InquisitorComponent;
  }

  calculateDPS(boardConfig) {
    console.group('Inquisitor DPS Calculation');

    const damageInfo = super.baseCalculateDPS(boardConfig);
    console.log('Base Damage Info:', damageInfo);
    console.log('Damage Increase:', this.damageIncrease, 'Damage Increase Steps:', Inquisitor.damageIncreaseSteps);
    const totalPhaseParts = Math.ceil(this.damageIncrease / Inquisitor.damageIncreaseSteps);
    console.log('Total Phase Parts:', totalPhaseParts);

    damageInfo.totalPhaseLengthSeconds = totalPhaseParts * damageInfo.newAttackSpeed;
    console.log('Total Phase Length (seconds):', damageInfo.totalPhaseLengthSeconds);

    let totalHitDamage = 0;
    let originalDamage = damageInfo.newAttackDamage;
    console.log('Original Damage:', originalDamage);

    for (let i = 0; i < totalPhaseParts; i++) {
      const currentDmgIncrease = Math.min(this.damageIncrease, Inquisitor.damageIncreaseSteps * (i + 1));
      console.log(`Current Damage Increase (iteration ${i+1}):`, currentDmgIncrease);

      const currentDamage = Math.floor(originalDamage * (1 + (currentDmgIncrease / 100)));
      console.log(`Current Damage (iteration ${i+1}):`, currentDamage);

      totalHitDamage += currentDamage;
      damageInfo.maxHitDamage = currentDamage;
    }

    console.log('Total Hit Damage:', totalHitDamage);

    const totalCritChance = damageInfo.totalCritChance;
    console.log('Total Critical Chance:', totalCritChance);

    const numberOfCrits = totalCritChance * totalPhaseParts;
    console.log('Number of Critical Hits:', numberOfCrits);

    damageInfo.critDmgPerSecond = Math.floor((numberOfCrits * damageInfo.criticalDamage) / damageInfo.totalPhaseLengthSeconds);
    console.log('Critical Damage Per Second:', damageInfo.critDmgPerSecond);

    damageInfo.dmgPerSecond = Math.floor(totalHitDamage / damageInfo.totalPhaseLengthSeconds);
    console.log('Damage Per Second:', damageInfo.dmgPerSecond);

    damageInfo.total = damageInfo.dmgPerSecond + damageInfo.critDmgPerSecond;
    console.log('Total Damage:', damageInfo.total);

    console.groupEnd();

    return damageInfo;
}


  toObject() {
    const baseObject = super.toObject();
    return {
      ...baseObject,
      absorbs: this.absorbs,
      damageIncrease: this.damageIncrease
    };
  }
}

function InquisitorComponent(props) {
  return (
    <div className="unit Inquisitor">
      <img src={Inquisitor.baseImage} width="70" alt="Inquisitor Unit" />
    </div>
  );
}

export { Inquisitor, InquisitorComponent };
