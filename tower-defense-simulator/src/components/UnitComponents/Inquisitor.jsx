import React from 'react';
import DmgSteppedUnit from '../../classes/DmgSteppedUnit';
import TalentsManager from '../../classes/TalentsManager';

class Inquisitor extends DmgSteppedUnit {
  static name = "Inquisitor";
  static defaultImage = "inquisitor.png";
  
  constructor(config) {
    super(config);
    // Inquisitor.applyDefaultConfig(config.defaults);
    // Inquisitor.applyStaticConfig(config.static);
    this.talentsManager = new TalentsManager(Inquisitor.name, config.talents);
    this.empowered = config.empowered || 0;
    this.damageIncrease = config.damageIncrease || Inquisitor.damageIncrease;
    this.component = InquisitorComponent;
  }

  static applyDefaultConfig(defaultConfig) {
    if (defaultConfig) {
      this.damageLevels = defaultConfig.damageLevels;
      this.speedTiers = defaultConfig.speedTiers;
    }
  }

  static applyStaticConfig(staticConfig) {
    if (staticConfig) {
      this.knightOfLightBonus = staticConfig.knightOfLightBonus;
      this.knightOfDarknessAbsorptionLimit = staticConfig.knightOfDarknessAbsorptionLimit;
      this.knightOfDarknessLowBonus = staticConfig.knightOfDarknessLowBonus;
      this.knightOfDarknessHighBonus = staticConfig.knightOfDarknessHighBonus;
      this.purificationSpeedBonus = staticConfig.purificationSpeedBonus;
      this.unityEmpoweredDamageBonus = staticConfig.unityEmpoweredDamageBonus;
      this.unityEmpoweredCriticalDamageBonus = staticConfig.unityEmpoweredCriticalDamageBonus;
      this.unityEmpoweredCritChanceBonus = staticConfig.unityEmpoweredCritChanceBonus;
      this.hammerOfFaithDamageMultiplier = staticConfig.hammerOfFaithDamageMultiplier;
    }
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
