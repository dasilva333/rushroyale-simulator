import React from 'react';
import DPSUnit from '../../classes/DPSUnit';

class Monk extends DPSUnit {
  static defaultImage = "monk.png";
  static name = "Monk";
  static harmonyTiers = [
    0,
    0,
    37.5,
    75,
    112.5,
    150,
    187.5,
    225
  ];

  constructor(config) {
    super(config);
    this.neighbors = config.neighbors || 3;
    this.isActivated = config.isActivated || false;
    this.component = MonkComponent;
  }

  calculateDPS(boardConfig) {
    let damage = this.baseDamage;
    let speed = this.baseSpeed;

     // The value of neighbors can be 0, 1, or 2 representing Harmony, Horizontal, and Vertical respectively.
    switch (this.neighbors) {
      case 0: // Harmony
        const harmonyBuff = Monk.harmonyTiers[this.tier];
        damage *= (1 + (harmonyBuff / 100));
        break;
      case 1: // Horizontal
        const horizontalBuff = 200;
        speed /= (1 + (horizontalBuff / 100));
        break;
      case 2: // Vertical
        const verticalBuff = 100;
        speed /= (1 + (verticalBuff / 100));
        break;
    }

    if (this.isActivated) {
      const activatedBuff = 100;
      damage *= (1 + (activatedBuff / 100));
    }

    return super.baseCalculateDPS(boardConfig, speed, damage, undefined, undefined);
  }

  toObject() {
    const baseObject = super.toObject();
    return {
      ...baseObject,
      // empowered: this.empowered,
      isActivated: this.isActivated,
    };
  }
}

function MonkComponent(props) {
  const empoweredSymbols = ['H', 'R', 'C'];
  const empoweredText = empoweredSymbols[props.unit.neighbors] || '';
  return (
    <div className="unit Monk">
      <div className="unit-tooltip top-left">{empoweredText}</div>
      {props.unit.isActivated && <div className="unit-tooltip top-right">A</div>}
      <img src={Monk.baseImage} width="70" alt="Monk Unit" />
    </div>
  );
}

export { Monk, MonkComponent };