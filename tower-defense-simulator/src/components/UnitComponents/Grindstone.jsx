import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Grindstone extends BaseUnit {
  static defaultImage = "grindstone.png";

  constructor(rateOfFire, damagePerHit) {
    super("Grindstone", rateOfFire, damagePerHit);
    this.component = GrindstoneComponent;
  }

  // Additional methods specific to the Grindstone unit here
}

function GrindstoneComponent(props) {
  return (
    <div className="unit Grindstone">
      <img src={Grindstone.baseImage} width="70" alt="Grindstone Unit" />
    </div>
  );
}

export { Grindstone, GrindstoneComponent };