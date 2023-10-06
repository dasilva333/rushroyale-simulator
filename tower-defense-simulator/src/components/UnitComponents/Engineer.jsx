import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Engineer extends BaseUnit {
  static defaultImage = "engineer.png";

  constructor(rateOfFire, damagePerHit) {
    super("Engineer", rateOfFire, damagePerHit);
    this.component = EngineerComponent;
  }

  // Additional methods specific to the Engineer unit here
}

function EngineerComponent(props) {
  return (
    <div className="unit Engineer">
      <img src="board/engineer.png" title={"hello " + Engineer.constructor.baseImage} width="70" alt="Engineer Unit" />
    </div>
  );
}

export { Engineer, EngineerComponent };