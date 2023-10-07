import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class Harly extends SupportUnit {
  static defaultImage = "harly.png";

  constructor(config) {
    super({
      name: "Harly",
      ...config
    });
    this.component = HarlyComponent;
  }

  // Additional methods specific to the Harly unit here
}

function HarlyComponent(props) {
  return (
    <div className="unit Harly">
      <img src={Harly.baseImage} width="70" alt="Harly Unit" />
    </div>
  );
}

export { Harly, HarlyComponent };