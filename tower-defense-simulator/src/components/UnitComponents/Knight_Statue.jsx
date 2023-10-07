import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class Knight_Statue extends SupportUnit {
  static defaultImage = "knight_statue.png";

  constructor(config) {
    super({
      name: "Knight_Statue",
      ...config
    });
    this.component = Knight_StatueComponent;
  }

  // Additional methods specific to the Knight_Statue unit here
}

function Knight_StatueComponent(props) {
  return (
    <div className="unit Knight_Statue">
      <img src={Knight_Statue.baseImage} width="70" alt="Knight_Statue Unit" />
    </div>
  );
}

export { Knight_Statue, Knight_StatueComponent };