import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class Grindstone extends SupportUnit {
  static defaultImage = "grindstone.png";

  constructor(config) {
    super({
      name: "Grindstone",
      ...config
    });
    this.component = GrindstoneComponent;
  }

  // Additional methods specific to the Grindstone unit here
}

function GrindstoneComponent(props) {
  return (
    <div className="unit Grindstone">
      <img src={Grindstone.baseImage} width="70" alt="Grindstone Unit" />
    </div>
  );
}

export { Grindstone, GrindstoneComponent };