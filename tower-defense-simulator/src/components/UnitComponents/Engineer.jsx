import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Engineer extends BaseUnit {
  static defaultImage = "engineer.png";

  constructor(config) {
    super({
      name: "Engineer",
      ...config
    });
    this.component = EngineerComponent;
  }

  // Additional methods specific to the Engineer unit here
}

function EngineerComponent(props) {
  return (
    <div className="unit Engineer">
      <img src={Engineer.baseImage} width="70" alt="Engineer Unit" />
    </div>
  );
}

export { Engineer, EngineerComponent };