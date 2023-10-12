import React from 'react';
import DmgSteppedUnit from '../../classes/DmgSteppedUnit';

class Crystalmancer extends DmgSteppedUnit {
  static name = "Crystal Mancer";
  static defaultImage = "crystalmancer.png";
  static baseDamage = 197;
  static baseSpeed = 0.07;
  static baseCrit = 0;
  static damageIncreaseSteps = 10;
  static damageIncrease = 800;
  static activationInterval = 0.95; // It's unclear if you want to use this property, but I've added it here for reference.

  constructor(config) {
    super(config);
    this.component = CrystalmancerComponent;
  }

  // Additional methods specific to the Crystalmancer unit, if any, can be added here
}

function CrystalmancerComponent(props) {
  return (
    <div className="unit Crystalmancer">
      <img src={Crystalmancer.baseImage} width="70" alt="Crystalmancer Unit" />
    </div>
  );
}

export { Crystalmancer, CrystalmancerComponent };
