import React from 'react';
import DPSUnit from '../../classes/DPSUnit';

class Engineer extends DPSUnit {
  static defaultImage = "engineer.png";
  static name = "Engineer";

  constructor(config) {
    super({
      name: "Engineer",
      ...config
    });
    this.connections = config.connections || 0;
    this.damageIncrease = config.damageIncrease || 0.05;
    this.component = EngineerComponent;
  }

  calculateDPS(boardConfig, boardManager) {
    const damageIncreasePerConnection = this.damageIncrease;
    let damage = this.baseDamage;
    
    damage *= (1 + (damageIncreasePerConnection * this.connections));

    return super.baseCalculateDPS(boardConfig, undefined, damage, undefined, undefined);
  }

  toObject() {
    const baseObject = super.toObject();
    return {
      ...baseObject,
      connections: this.connections
    };
  }
}

function EngineerComponent(props) {
  return (
    <div className="unit Engineer">
      <div className="unit-tooltip top-left">{props.unit.connections}</div>
      <img src={Engineer.baseImage} width="70" alt="Engineer Unit" />
    </div>
  );
}

export { Engineer, EngineerComponent };