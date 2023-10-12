import React from 'react';
import DmgSteppedUnit from '../../classes/DmgSteppedUnit';
import TalentsManager from '../../classes/TalentsManager';

class Inquisitor extends DmgSteppedUnit {
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
  // static talents = {
  //   "KnightOfLight": { "selected": true, "bossesKilled": 3 },
  //   "KnightOfDarkness": { "selected": false, "absorbs": 0 },
  //   "Purification": { "selected": true, "isActive": false },
  //   "ShieldOfFaith": { "selected": false },
  //   "Ronin": { "selected": false },
  //   "Unity": { "selected": true },
  //   "HammerOfFaith": { "selected": false, "hammerStunActive": false }
  // };

  // Talent-related constants
  static KNIGHT_OF_LIGHT_BONUS = 2.5;
  static KNIGHT_OF_DARKNESS_ABSORPTION_LIMIT = 20;
  static KNIGHT_OF_DARKNESS_LOW_BONUS = 6;
  static KNIGHT_OF_DARKNESS_HIGH_BONUS = 3.5;
  static PURIFICATION_SPEED_BONUS = 1.1;
  static UNITY_EMPPOWERED_DAMAGE_BONUS = 1.15;
  static UNITY_EMPPOWERED_CRITICAL_DAMAGE_BONUS = 1.35;
  static UNITY_EMPPOWERED_CRIT_CHANCE_BONUS = 8;
  static HAMMER_OF_FAITH_DAMAGE_MULTIPLIER = 7.77;
  
  constructor(config) {
    super(config);
    // this.talents = config.talents || Inquisitor.talents;
    this.talentsManager = new TalentsManager(Inquisitor.name, config.talents);
    this.empowered = config.empowered || 0;
    this.damageIncrease = config.damageIncrease || Inquisitor.damageIncrease;
    this.component = InquisitorComponent;
  }

  static getEmpowermentCondition(boardManager) {
    return boardManager.getUnitCounts(Inquisitor.name);
  }

  calculateDPS(boardConfig) {
    // Step 1: Calculate base stats
    const damageInfo = super.baseCalculateDPS(boardConfig);

    // Step 2: Apply talent buffs/modifications
    if (this.talentsManager.isTalentSelected('KnightOfLight')) {
      const bossesKilled = this.talentsManager.getInstanceTalentProperty('KnightOfLight', 'bossesKilled') || 0;
      const bonusPercentage = Inquisitor.KNIGHT_OF_LIGHT_BONUS * bossesKilled;
      damageInfo.newAttackDamage += damageInfo.newAttackDamage * (bonusPercentage / 100);
    }

    if (this.talentsManager.isTalentSelected('KnightOfDarkness')) {
      const absorption = this.talentsManager.getInstanceTalentProperty('KnightOfDarkness', 'absorbs') || 0;
      const bonusPercentage = absorption <= Inquisitor.KNIGHT_OF_DARKNESS_ABSORPTION_LIMIT ? 
        Inquisitor.KNIGHT_OF_DARKNESS_LOW_BONUS * absorption : 
        (Inquisitor.KNIGHT_OF_DARKNESS_LOW_BONUS * Inquisitor.KNIGHT_OF_DARKNESS_ABSORPTION_LIMIT) + 
        ((absorption - Inquisitor.KNIGHT_OF_DARKNESS_ABSORPTION_LIMIT) * Inquisitor.KNIGHT_OF_DARKNESS_HIGH_BONUS);
      damageInfo.newAttackDamage += damageInfo.newAttackDamage * (bonusPercentage / 100);
    }

    if (this.talentsManager.isTalentSelected('Purification') && this.talentsManager.getInstanceTalentProperty('Purification', 'isActive')) {
      damageInfo.newAttackSpeed *= Inquisitor.PURIFICATION_SPEED_BONUS;
    }

    if (this.talentsManager.isTalentSelected('Unity')) {
      if (this.empowered >= 10) {
        damageInfo.totalCritChance += Inquisitor.UNITY_EMPPOWERED_CRIT_CHANCE_BONUS;
      }
      if (this.empowered >= 7) {
        damageInfo.criticalDamage *= Inquisitor.UNITY_EMPPOWERED_CRITICAL_DAMAGE_BONUS;
      }
      if (this.empowered >= 4) {
        damageInfo.newAttackDamage *= Inquisitor.UNITY_EMPPOWERED_DAMAGE_BONUS;
      }
    }

    if (this.talentsManager.isTalentSelected('HammerOfFaith') && this.talentsManager.getInstanceTalentProperty('HammerOfFaith', 'hammerStunActive')) {
      damageInfo.newAttackDamage *= Inquisitor.HAMMER_OF_FAITH_DAMAGE_MULTIPLIER;
    }

   // Step 3: Call calculateSteppedDamage() to compute damage over the stepped phases
   return this.calculateSteppedDamage(damageInfo);
  }

  toObject() {
    const baseObject = super.toObject();
    return {
      ...baseObject,
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
