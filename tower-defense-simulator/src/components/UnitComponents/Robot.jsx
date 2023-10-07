import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Robot extends BaseUnit {
  static defaultImage = "robot.png";

  constructor(config) {
    super({
      name: "Robot",
      ...config
    });
    this.component = RobotComponent;
  }

  // Additional methods specific to the Robot unit here
}

function RobotComponent(props) {
  return (
    <div className="unit Robot">
      <img src={Robot.baseImage} width="70" alt="Robot Unit" />
    </div>
  );
}

export { Robot, RobotComponent };