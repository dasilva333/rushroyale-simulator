import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Bladedancer extends BaseUnit {
  static defaultImage = "bladedancer.png";

  constructor(rateOfFire, damagePerHit) {
    super("Bladedancer", rateOfFire, damagePerHit);
    this.component = BladedancerComponent;
  }

  // Additional methods specific to the Bladedancer unit here
}

function BladedancerComponent(props) {
  return (
    <div className="unit Bladedancer">
      <img src={Bladedancer.baseImage} width="70" alt="Bladedancer Unit" />
    </div>
  );
}

export { Bladedancer, BladedancerComponent };