import React from 'react';
import DPSUnit from '../../classes/DPSUnit';

class DemonHunter extends DPSUnit {
  static defaultImage = "demonhunter.png";
  static name = "DemonHunter";  // Set name for all instances

  constructor(config) {
      super(config);
      this.demonHunterEmpowered = false;
      this.damageIncrease = config.damageIncrease || 75;
      this.tier = config.level || 7;
      this.component = DemonHunterComponent;
  }

  calculateDPS() {
    let damage = this.baseDamage;

    if (this.demonHunterEmpowered) {
        damage *= (1 + (this.damageIncrease / 100));
    }

    damage *= this.tier;

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
        damageIncrease: this.damageIncrease,
        tier: this.tier
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
