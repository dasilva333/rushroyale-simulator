import React from 'react';
import DPSUnit from '../../classes/DPSUnit';

class DemonHunter extends DPSUnit {
  static defaultImage = "demonhunter.png";
  static name = "DemonHunter";  // Set name for all instances

  constructor(config) {
      super(config);
      this.demonHunterEmpowered = config.demonHunterEmpowered || false;
      this.mainDpsDamageIncrease = config.mainDpsDamageIncrease || 75;
      this.mainDpsTierLevel = config.level || 7;
      this.component = DemonHunterComponent;
  }

  calculateDPS() {
    let damage = this.baseDamage;

    if (this.demonHunterEmpowered) {
        damage *= (1 + (this.mainDpsDamageIncrease / 100));
    }

    damage *= this.mainDpsTierLevel;

    // Using super to call the baseCalculateDPS method of the parent class (DPSUnit)
    return super.baseCalculateDPS(
      {playerCrit:3000}, //boardConfig
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
        demonHunterEmpowered: this.demonHunterEmpowered,
        mainDpsDamageIncrease: this.mainDpsDamageIncrease,
        mainDpsTierLevel: this.mainDpsTierLevel
        // ... other DemonHunter specific properties
    };
}
}

function DemonHunterComponent(props) {
  return (
      <div className="unit DemonHunter">
          <img src={DemonHunter.baseImage} width="70" alt="DemonHunter Unit" />
      </div>
  );
}

export { DemonHunter, DemonHunterComponent };
