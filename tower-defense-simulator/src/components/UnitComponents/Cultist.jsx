import React from 'react';
import DPSUnit from '../../classes/DPSUnit';

class Cultist extends DPSUnit {
  static defaultImage = "cultist.png";
  static name = "Cultist";
  static empowermentThreshold = 4;  // 4 adjacent cultists to be empowered

  constructor(config) {
    super(config);
    this.empowered = config.empowered || 0;
    this.component = CultistComponent;
  }

  static getEmpowermentCondition(boardManager, unit) {
      let empowermentStatus = 0; // Default status is 0 (not empowered)
      if (unit.neighbors === Cultist.empowermentThreshold) {
          empowermentStatus = 1; // Directly empowered
      } else {
          const neighbors = boardManager.getAdjacentUnitsForTile(unit.x, unit.y);
          for (let neighbor of neighbors) {
              if (neighbor.constructor.name === Cultist.name && neighbor.neighbors === 4) {
                  empowermentStatus = 2; // Empowered by connection to an empowered Cultist
                  break;
              }
          }
      }
      // console.log(`getEmpowermentCondition: ${empowermentStatus} neighbors: ${unit.neighbors}`, unit);
      return empowermentStatus;
  }

  calculateDPS(boardConfig) {
    let damage = this.baseDamage;
    let speed = this.baseSpeed;
    let crit = this.baseCrit;

    // Use instance properties directly
    const empowermentStatus = this.empowered;
    const adjacentCultists = this.neighbors;

    // Always adjust attack speed based on adjacent Cultists
    speed /= (adjacentCultists + 1);

    switch (empowermentStatus) {
      case 0:
        // Not empowered and not connected to an empowered Cultist
        crit = 0; // Reset crit chance to 0
        break;
      case 1:
        // Directly empowered (has 4 adjacent Cultists)
        damage *= (1 + this.damageIncrease / 100); // Assuming you have damageIncrease defined somewhere in the class
        break;
      case 2:
        // Connected to an empowered Cultist but not directly empowered
        // Retains its base crit chance. So, no change is required.
        break;
      default:
        console.error("Unexpected empowerment status for Cultist.", empowermentStatus);
    }

    return super.baseCalculateDPS(boardConfig, speed, damage, crit, undefined);
  }

  toObject() {
    const baseObject = super.toObject();
    return {
      ...baseObject,
      empowered: this.empowered,
      // ... any other Cultist specific attributes you wish to serialize.
    };
  }
}

function CultistComponent(props) {
  const { empowered } = props.unit;

  let backgroundColor;
  switch (empowered) {
    case 0:
      backgroundColor = 'red';
      break;
    case 1:
      backgroundColor = 'green';
      break;
    case 2:
      backgroundColor = 'orange';
      break;
    default:
      backgroundColor = 'transparent';
  }

  return (
    <div className="unit Cultist" style={{ backgroundColor }}>
      <img src={Cultist.baseImage} width="70" alt="Cultist Unit" />
    </div>
  );
}

export { Cultist, CultistComponent };
