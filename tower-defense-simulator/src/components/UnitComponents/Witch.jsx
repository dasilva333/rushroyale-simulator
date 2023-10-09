import React from 'react';
import DPSUnit from '../../classes/DPSUnit';

class Witch extends DPSUnit {
  static defaultImage = "witch.png";
  static divider = 10;
  static baseBuff = 38;
  static baseBonus = 10;
  static bonusAddon = 4;

  constructor(config) {
    super({
      name: "Witch",
      ...config
    });
    this.component = WitchComponent;
    this.merges = config.merges || this.merges;
    // console.log("initializing witch class with config", config, this);
  }

  static getUnitBuffs(key, { level, merges }) {
    if (key === "damage") {
      const cardBonus = level - 9;
      const dmgIncrease = this.baseBuff + (this.baseBonus + (this.bonusAddon * cardBonus));
      return parseFloat(((dmgIncrease / this.divider) * merges).toFixed(2));
    }
    return 0; // Return 0 if the buffType doesn't match any known buffs
  }

  // Additional methods specific to the Witch unit here
  toObject() {
    // Grab the serialized properties from the parent class
    const baseObject = super.toObject();

    // Return the merged object
    return {
      ...baseObject,
      merges: this.merges
    };
  }
}

function WitchComponent(props) {
  return (
    <div className="unit Witch">
      <img src={Witch.baseImage} width="70" alt="Witch Unit" />
    </div>
  );
}

export { Witch, WitchComponent };
