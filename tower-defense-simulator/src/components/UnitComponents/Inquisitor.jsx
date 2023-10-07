import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Inquisitor extends BaseUnit {
  static defaultImage = "inquisitor.png";

  constructor(config) {
    super({
      name: "Inquisitor",
      ...config
    });
    this.component = InquisitorComponent;
  }

  // Additional methods specific to the Inquisitor unit here
}

function InquisitorComponent(props) {
  return (
    <div className="unit Inquisitor">
      <img src={Inquisitor.baseImage} width="70" alt="Inquisitor Unit" />
    </div>
  );
}

export { Inquisitor, InquisitorComponent };