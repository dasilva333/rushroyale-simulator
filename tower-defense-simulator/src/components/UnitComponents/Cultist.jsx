import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Cultist extends BaseUnit {
  static defaultImage = "cultist.png";

  constructor(rateOfFire, damagePerHit) {
    super("Cultist", rateOfFire, damagePerHit);
    this.component = CultistComponent;
  }

  // Additional methods specific to the Cultist unit here
}

function CultistComponent(props) {
  return (
    <div className="unit Cultist">
      <img src={Cultist.baseImage} width="70" alt="Cultist Unit" />
    </div>
  );
}

export { Cultist, CultistComponent };