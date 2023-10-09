import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class Chemist extends SupportUnit {
  static defaultImage = "chemist.png";
  static baseDmg = 40;
  static multiplier = 0.5;
  static bonus = 4.5;

  constructor(config) {
    super({
      name: "Chemist",
      ...config
    });
    this.component = ChemistComponent;
  }

  static getGlobalBuffs(buffType, { level: cardLevel, tier: tierLevel }) {
    if (buffType === 'armor-damage') {
      console.log('cardLevel', cardLevel, 'tierLevel', tierLevel);
      let totalDamage = this.baseDmg + 
                        (this.multiplier * (cardLevel - 6)) + 
                        ((this.multiplier * (cardLevel - 6)) + this.bonus) * (tierLevel - 1);
      return totalDamage + this.bonus;
    }
    return 0; // Return 0 if the buffType doesn't match any known buffs
  }

  // Additional methods specific to the Chemist unit here
}

function ChemistComponent(props) {
  return (
    <div className="unit Chemist">
      <img src={Chemist.baseImage} width="70" alt="Chemist Unit" />
    </div>
  );
}

export { Chemist, ChemistComponent };
