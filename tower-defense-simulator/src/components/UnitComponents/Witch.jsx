import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Witch extends BaseUnit {
  static defaultImage = "witch.png";

  constructor(rateOfFire, damagePerHit) {
    super("Witch", rateOfFire, damagePerHit);
    this.component = WitchComponent;
  }

  // Additional methods specific to the Witch unit here
}

function WitchComponent(props) {
  return (
    <div className="unit Witch">
      <img src={Witch.baseImage} width="70" alt="Witch Unit" />
    </div>
  );
}

export { Witch, WitchComponent };