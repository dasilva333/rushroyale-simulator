import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class Sword extends SupportUnit {
  static defaultImage = "sword.png";
  static baseBuffDamage = 200; 
  static baseCritChance = 5; // 5% crit-chance at 10 stacks
  static critBuffAtStacks = 10; 

  constructor(config) {
    super({
      name: "Sword",
      ...config
    });
    this.component = SwordComponent;
  }

  // Method to get sword buffs
  static getSwordBuffs(level, stackCount, hasKnightStatue = false) {
    const dmgMultiplier = hasKnightStatue ? 0.2 : 1; // if knight statue is there, buff is divided by 5
    const critMultiplier = hasKnightStatue ? 0.2 : 1; 

    const baseBuff = (this.baseBuffDamage / 10) + ((level - 7) * 1.5);
    const buffDamageValue = baseBuff * stackCount * dmgMultiplier;

    let buffs = [];
    // Add damage buff
    buffs.push({ type: 'damage', value: buffDamageValue });
    
    // Add crit-chance buff if stackCount is 10 or more
    if (stackCount >= this.critBuffAtStacks) {
        buffs.push({ type: 'crit-chance', value: this.baseCritChance * critMultiplier });
    }

    return buffs;
  }
}

function SwordComponent(props) {
  return (
    <div className="unit Sword">
      <img src={Sword.baseImage} width="70" alt="Sword Unit" />
    </div>
  );
}

export { Sword, SwordComponent };
