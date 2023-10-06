import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Boreas extends BaseUnit {
  static defaultImage = "boreas.png";

  constructor(rateOfFire, damagePerHit) {
    super("Boreas", rateOfFire, damagePerHit);
    this.component = BoreasComponent;
  }

  // Additional methods specific to the Boreas unit here
}

function BoreasComponent(props) {
  return (
    <div className="unit Boreas">
      <img src={Boreas.baseImage} width="70" alt="Boreas Unit" />
    </div>
  );
}

export { Boreas, BoreasComponent };