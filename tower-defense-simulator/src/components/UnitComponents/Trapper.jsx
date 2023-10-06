import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Trapper extends BaseUnit {
  static defaultImage = "trapper.png";

  constructor(rateOfFire, damagePerHit) {
    super("Trapper", rateOfFire, damagePerHit);
    this.component = TrapperComponent;
  }

  // Additional methods specific to the Trapper unit here
}

function TrapperComponent(props) {
  return (
    <div className="unit Trapper">
      <img src={Trapper.baseImage} width="70" alt="Trapper Unit" />
    </div>
  );
}

export { Trapper, TrapperComponent };