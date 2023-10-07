import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class Trapper extends SupportUnit {
  static defaultImage = "trapper.png";

  constructor(config) {
    super({
      name: "Trapper",
      ...config
    });
    this.component = TrapperComponent;
  }

  // Additional methods specific to the Trapper unit here
}

function TrapperComponent(props) {
  return (
    <div className="unit Trapper">
      <img src={Trapper.baseImage} width="70" alt="Trapper Unit" />
    </div>
  );
}

export { Trapper, TrapperComponent };