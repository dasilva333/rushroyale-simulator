import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class Dryad extends SupportUnit {
  static defaultImage = "dryad.png";

  constructor(config) {
    super({
      name: "Dryad",
      ...config
    });
    this.component = DryadComponent;
  }

  // Additional methods specific to the Dryad unit here
}

function DryadComponent(props) {
  return (
    <div className="unit Dryad">
      <img src={Dryad.baseImage} width="70" alt="Dryad Unit" />
    </div>
  );
}

export { Dryad, DryadComponent };