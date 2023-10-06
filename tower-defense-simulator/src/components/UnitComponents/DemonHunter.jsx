import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class DemonHunter extends BaseUnit {
  static defaultImage = "demonhunter.png";

  constructor(rateOfFire, damagePerHit) {
    super("DemonHunter", rateOfFire, damagePerHit);
    this.component = DemonHunterComponent;
  }

  // Additional methods specific to the DemonHunter unit here
}

function DemonHunterComponent(props) {
  return (
    <div className="unit DemonHunter">
      <img src={DemonHunter.baseImage} width="70" alt="DemonHunter Unit" />
    </div>
  );
}

export { DemonHunter, DemonHunterComponent };