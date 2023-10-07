import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class Sword extends SupportUnit {
  static defaultImage = "sword.png";

  constructor(config) {
    super({
      name: "Sword",
      ...config
    });
    this.component = SwordComponent;
  }

  // Additional methods specific to the Sword unit here
}

function SwordComponent(props) {
  return (
    <div className="unit Sword">
      <img src={Sword.baseImage} width="70" alt="Sword Unit" />
    </div>
  );
}

export { Sword, SwordComponent };