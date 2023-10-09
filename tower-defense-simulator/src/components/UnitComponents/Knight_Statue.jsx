import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class Knight_Statue extends SupportUnit {
  static defaultImage = "knight_statue.png";
  static critTiers = [5, 7.5, 10, 12.5, 15, 17.5, 20];

  constructor(config) {
    super({
      name: "Knight_Statue",
      ...config
    });
    this.component = Knight_StatueComponent;
  }

  static getUnitBuffs(key, { tier, level }) {
    switch (key) {
      case "speed":
        return this.getKsSpeed({ tier, level });
      case "crit-chance":
        return this.getKsCrit({ tier, level });
      default:
        return 0;
    }
  }

  static getKsCrit({ tier }) {
    // The card variable refers to the second parameter and is deconstructed
    return Knight_Statue.critTiers[tier - 1]; // Assuming there's a critTiers array in SupportUnit
  }

  static getKsSpeed({ tier, level }) {
    const minLevel = SupportUnit.levels[0]; // Assuming there's a levels array in SupportUnit
    const manaBonus = 10 + (level - minLevel);
    return manaBonus + ((level + 3) * tier);
  }

  // Any additional methods specific to the Knight_Statue unit can be added here
}

function Knight_StatueComponent(props) {
  return (
    <div className="unit Knight_Statue">
      <img src={Knight_Statue.baseImage} width="70" alt="Knight_Statue Unit" />
    </div>
  );
}

export { Knight_Statue, Knight_StatueComponent };
