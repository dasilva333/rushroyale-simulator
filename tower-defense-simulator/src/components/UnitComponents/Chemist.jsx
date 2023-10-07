import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class Chemist extends SupportUnit {
  static defaultImage = "chemist.png";

  constructor(config) {
    super({
      name: "Chemist",
      ...config
    });
    this.component = ChemistComponent;
  }

  // Additional methods specific to the Chemist unit here
}

function ChemistComponent(props) {
  return (
    <div className="unit Chemist">
      <img src={Chemist.baseImage} width="70" alt="Chemist Unit" />
    </div>
  );
}

export { Chemist, ChemistComponent };