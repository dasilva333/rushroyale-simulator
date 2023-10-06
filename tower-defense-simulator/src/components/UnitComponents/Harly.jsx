import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Harly extends BaseUnit {
  static defaultImage = "harly.png";

  constructor(rateOfFire, damagePerHit) {
    super("Harly", rateOfFire, damagePerHit);
    this.component = HarlyComponent;
  }

  // Additional methods specific to the Harly unit here
}

function HarlyComponent(props) {
  return (
    <div className="unit Harly">
      <img src={Harly.baseImage} width="70" alt="Harly Unit" />
    </div>
  );
}

export { Harly, HarlyComponent };