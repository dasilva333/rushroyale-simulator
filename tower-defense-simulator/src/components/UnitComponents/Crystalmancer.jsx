import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Crystalmancer extends BaseUnit {
  static defaultImage = "crystalmancer.png";

  constructor(rateOfFire, damagePerHit) {
    super("Crystalmancer", rateOfFire, damagePerHit);
    this.component = CrystalmancerComponent;
  }

  // Additional methods specific to the Crystalmancer unit here
}

function CrystalmancerComponent(props) {
  return (
    <div className="unit Crystalmancer">
      <img src={Crystalmancer.baseImage} width="70" alt="Crystalmancer Unit" />
    </div>
  );
}

export { Crystalmancer, CrystalmancerComponent };