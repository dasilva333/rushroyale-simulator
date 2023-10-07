import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Monk extends BaseUnit {
  static defaultImage = "monk.png";

  constructor(config) {
    super({
      name: "Monk",
      ...config
    });
    this.component = MonkComponent;
  }

  // Additional methods specific to the Monk unit here
}

function MonkComponent(props) {
  return (
    <div className="unit Monk">
      <img src={Monk.baseImage} width="70" alt="Monk Unit" />
    </div>
  );
}

export { Monk, MonkComponent };