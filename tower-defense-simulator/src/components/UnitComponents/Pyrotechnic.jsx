import DPSUnit from '../../classes/DPSUnit';
import AoEHelper from '../../classes/AOEHelper.js';
import DamageValues from '../../classes/DamageValues.js';

class Pyrotechnic extends DPSUnit {
  static defaultImage = "pyrotechnic.png";
  static name = "Pyrotechnic";

  constructor(config) {
    super(config);
    this.empowered = config.empowered || false;
    this.component = PyrotechnicComponent;
  }

  static getEmpowermentCondition(boardManager) {
    const total = boardManager.getUnitCounts(Pyrotechnic.name);
    return total % 2 !== 0; // True for odd, False for even
  }

  calculateDPS(boardConfig) {
    let damage = this.baseDamage;
    let speed = this.baseSpeed;
    let aoeDamageValues = new DamageValues(); // Default to no AoE damage

    if (this.empowered) { // Odd number of Pyrotechnics
      speed *= 0.5; // 50% reduction in speed
      const aoeLength = DPSUnit.aoeRadius * 2; // Diameter for empowered state (random target)
      aoeDamageValues = this.calculateAOEDamage(aoeLength, boardConfig);
    } else { // Even number of Pyrotechnics
      damage *= 0.5; // 50% reduction in damage
    }

    const regularDamageValues = super.baseCalculateDPS(boardConfig, speed, damage);

    return new DamageValues(
      Math.floor(regularDamageValues.total + aoeDamageValues.dmgPerSecond),
      regularDamageValues.newAttackDamage + aoeDamageValues.newAttackDamage,
      regularDamageValues.newAttackSpeed,
      regularDamageValues.dmgPerSecond + aoeDamageValues.dmgPerSecond,
      regularDamageValues.critDmgPerSecond,
      regularDamageValues.hitsPerSecond,
      regularDamageValues.critHitsPerSecond,
      regularDamageValues.criticalDamage,
      regularDamageValues.totalCritChance
    );
  }

  calculateAOEDamage(aoeLength, boardConfig) {
    const aoeDamage = AoEHelper.calculateAoEDamage(aoeLength, boardConfig.waveIndex, this.baseDamage);
    const newAttackSpeed = this.computeAttackSpeed(this.baseSpeed);
    const hitsPerSecond = 1 / newAttackSpeed;

    return new DamageValues(
      aoeDamage, // Only AoE damage is relevant here
      this.baseDamage,
      newAttackSpeed,
      aoeDamage,
      0,
      hitsPerSecond,
      0,
      0,
      0
    );
  }

  toObject() {
    const baseObject = super.toObject();
    return {
      ...baseObject,
      empowered: this.empowered
    };
  }
}

function PyrotechnicComponent(props) {
  return (
    <div className="unit Pyrotechnic">
      <div className="unit-tooltip top-left">{props.unit.empowered ? 'E' : 'N'}</div>
      <img src={Pyrotechnic.baseImage} width="70" alt="Pyrotechnic Unit" />
    </div>
  );
}

export { Pyrotechnic, PyrotechnicComponent };
