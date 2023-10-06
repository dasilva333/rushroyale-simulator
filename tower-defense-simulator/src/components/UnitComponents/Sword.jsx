import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Sword extends BaseUnit {
  static defaultImage = "sword.png";

  constructor(rateOfFire, damagePerHit) {
    super("Sword", rateOfFire, damagePerHit);
    this.component = SwordComponent;
  }

  // Additional methods specific to the Sword unit here
}

function SwordComponent(props) {
  return (
    <div className="unit Sword">
      <img src={Sword.baseImage} width="70" alt="Sword Unit" />
    </div>
  );
}

export { Sword, SwordComponent };