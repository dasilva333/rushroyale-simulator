import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class KnightStatue extends SupportUnit {
  static defaultImage = "knight_statue.png";
  static critTiers = [5, 7.5, 10, 12.5, 15, 17.5, 20];

  constructor(config) {
    super({
      name: "KnightStatue",
      ...config
    });
    this.component = KnightStatueComponent;
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
    return KnightStatue.critTiers[tier - 1]; // Assuming there's a critTiers array in SupportUnit
  }

  static getKsSpeed({ tier, level }) {
    const minLevel = SupportUnit.levels[0]; // Assuming there's a levels array in SupportUnit
    const manaBonus = 10 + (level - minLevel);
    return manaBonus + ((level + 3) * tier);
  }

  // Any additional methods specific to the Knight_Statue unit can be added here
}

function KnightStatueComponent(props) {
  return (
    <div className="unit KnightStatue">
      <img src={KnightStatue.baseImage} width="70" alt="KnightStatue Unit" />
    </div>
  );
}

export { KnightStatue, KnightStatueComponent };
