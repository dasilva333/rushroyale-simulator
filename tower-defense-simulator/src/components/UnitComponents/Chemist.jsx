import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Chemist extends BaseUnit {
  static defaultImage = "chemist.png";

  constructor(rateOfFire, damagePerHit) {
    super("Chemist", rateOfFire, damagePerHit);
    this.component = ChemistComponent;
  }

  // Additional methods specific to the Chemist unit here
}

function ChemistComponent(props) {
  return (
    <div className="unit Chemist">
      <img src={Chemist.baseImage} width="70" alt="Chemist Unit" />
    </div>
  );
}

export { Chemist, ChemistComponent };