import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Bruiser extends BaseUnit {
  static defaultImage = "bruiser.png";

  constructor(rateOfFire, damagePerHit) {
    super("Bruiser", rateOfFire, damagePerHit);
    this.component = BruiserComponent;
  }

  // Additional methods specific to the Bruiser unit here
}

function BruiserComponent(props) {
  return (
    <div className="unit Bruiser">
      <img src={Bruiser.baseImage} width="70" alt="Bruiser Unit" />
    </div>
  );
}

export { Bruiser, BruiserComponent };