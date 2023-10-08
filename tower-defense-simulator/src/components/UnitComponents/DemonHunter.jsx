import React from 'react';
import DPSUnit from '../../classes/DPSUnit';

class DemonHunter extends DPSUnit {
  static defaultImage = "demonhunter.png";
  static name = "DemonHunter";  // Set name for all instances
  static empowermentThreshold = 40;

  constructor(config) {
    super(config);
    this.empowered = config.empowered || false;
    this.damageIncrease = config.damageIncrease || 75;
    this.tier = config.tier || 7;
    this.level = config.level || 15;
    this.component = DemonHunterComponent;
  }


  static getEmpowermentCondition(boardManager) {
    const totalTiers = boardManager.getTotalTiersForUnit(DemonHunter.name);
    return totalTiers >= DemonHunter.empowermentThreshold;
  }

  calculateDPS(boardConfig) {
    let damage = this.baseDamage;

    if (this.empowered) {
      damage *= (1 + (this.damageIncrease / 100));
    }

    damage *= this.tier;

    // Using super to call the baseCalculateDPS method of the parent class (DPSUnit)
    return super.baseCalculateDPS(
      boardConfig,
      this.baseSpeed, // Use default speed value
      damage,
      undefined, // Default crit chance will be used
      undefined  // Default crit damage will be used
    );
  }

  toObject() {
    // Grab the serialized properties from the parent class
    const baseObject = super.toObject();

    // Return the merged object
    return {
      ...baseObject,
      empowered: this.empowered,
      damageIncrease: this.damageIncrease,
      tier: this.tier,
      level: this.level
    };
  }
}

function DemonHunterComponent(props) {
  const backgroundColor = props.unit.empowered ? 'yellow' : 'transparent';
  return (
      <div className="unit DemonHunter" style={{ backgroundColor }}>
          <img src={DemonHunter.baseImage} width="70" alt="DemonHunter Unit" />
      </div>
  );
}



export { DemonHunter, DemonHunterComponent };
