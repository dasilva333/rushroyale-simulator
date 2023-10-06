import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Dryad extends BaseUnit {
  static defaultImage = "dryad.png";

  constructor(rateOfFire, damagePerHit) {
    super("Dryad", rateOfFire, damagePerHit);
    this.component = DryadComponent;
  }

  // Additional methods specific to the Dryad unit here
}

function DryadComponent(props) {
  return (
    <div className="unit Dryad">
      <img src={Dryad.baseImage} width="70" alt="Dryad Unit" />
    </div>
  );
}

export { Dryad, DryadComponent };