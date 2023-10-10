import React from 'react';
import DPSUnit from '../../classes/DPSUnit';

class Inquisitor extends DPSUnit {
  static name = "Inquisitor";
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
  static speedTiers = {
    1: 0,
    2: 0.3,
    3: 0.4,
    4: 0.45,
    5: 0.48,
    6: 0.5,
    7: 0.51
  };
  static baseDamage = 120;
  static baseSpeed = 0.6;
  static talents = {
    "KnightOfLight": {
      "selected": true,
      "bossesKilled": 3
    },
    "KnightOfDarkness": {
      "selected": false,
      "absorbs": 0
    },
    "Purification": {
      "selected": true,
      "isActive": false
    },
    "ShieldOfFaith": {
      "selected": false
    },
    "Ronin": {
      "selected": false
    },
    "Unity": {
      "selected": true
    },
    "HammerOfFaith": {
      "selected": false,
      "hammerStunActive": false
    }
  };

  constructor(config) {
    super(config);
    this.absorbs = config.absorbs || 0;
    this.talents = config.talents || Inquisitor.talents;
    this.empowered = config.empowered || 0;
    this.damageIncrease = config.damageIncrease || Inquisitor.damageIncrease;
    this.component = InquisitorComponent;
  }

  static getEmpowermentCondition(boardManager) {
    // Return the total number of Inquisitors
    return boardManager.getUnitCounts(Inquisitor.name);
  }

  calculateDPS(boardConfig) {
    console.group('Inquisitor DPS Calculation');

    const damageInfo = super.baseCalculateDPS(boardConfig);

    if (this.talents.KnightOfLight.selected) {
      const bonusPercentage = 2.5 * this.talents.KnightOfLight.bossesKilled;
      damageInfo.newAttackDamage += damageInfo.newAttackDamage * (bonusPercentage / 100);
    }

    if (this.talents.KnightOfDarkness.selected) {
      const absorption = this.talents.KnightOfDarkness.absorbs;
      const bonusPercentage = absorption <= 20 ? 6 * absorption : (6 * 20) + ((absorption - 20) * 3.5);
      damageInfo.newAttackDamage += damageInfo.newAttackDamage * (bonusPercentage / 100);
    }

    if (this.talents.Purification.selected && this.talents.Purification.isActive) {
      damageInfo.newAttackSpeed *= 1.1; // 10% increase
    }

    if (this.talents.Unity.selected) {
      if (this.empowered >= 10) {
        damageInfo.totalCritChance += 8; // additional 8% critical chance
      }
      if (this.empowered >= 7) {
        damageInfo.criticalDamage *= 1.35; // 35% increase in critical damage
      }
      if (this.empowered >= 4) {
        damageInfo.newAttackDamage *= 1.15; // 15% increase in damage
      }
    }

    if (this.talents.HammerOfFaith.selected && this.talents.HammerOfFaith.hammerStunActive) {
      damageInfo.newAttackDamage *= 7.77; // Increase damage by 777%
    }



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
      console.log(`Current Damage Increase (iteration ${i + 1}):`, currentDmgIncrease);

      const currentDamage = Math.floor(originalDamage * (1 + (currentDmgIncrease / 100)));
      console.log(`Current Damage (iteration ${i + 1}):`, currentDamage);

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
      talents: this.talents,
      damageIncrease: this.damageIncrease,
      empowered: this.empowered 
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
