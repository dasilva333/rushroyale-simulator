import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Generic extends BaseUnit {
  static defaultImage = "generic.png";

  constructor(config) {
    super({
      name: "Generic",
      ...config
    });
    this.component = GenericComponent;
  }

  // Additional methods specific to the Generic unit here
}

function GenericComponent(props) {
  return (
    <div className="unit Generic">
      <img src={Generic.baseImage} width="70" alt="Generic Unit" />
    </div>
  );
}

export { Generic, GenericComponent };