import DPSUnit from '../../classes/DPSUnit';

class BladeDancer extends DPSUnit {
  static defaultImage = "bladedancer.png";
  static name = "BladeDancer";
  static dmgIncreaseLevels = [
    0,
    0,
    200,
    250,
    291,
    332,
    375,
    416,
    450
  ];

  constructor(config) {
    super(config);
    this.empowered = config.empowered || 0;
    this.damageIncrease = BladeDancer.calculateDamageIncrease(this.empowered);
    this.component = BladeDancerComponent;
  }

  static getEmpowermentCondition(boardManager) {
    // Return the total number of BladeDancers
    const total = boardManager.getUnitCounts(BladeDancer.name);
    // console.log(`total: ${total}`);
    return total;
  }

  static calculateDamageIncrease(empowered) {
    let damageIncrease;
    if (empowered >= BladeDancer.dmgIncreaseLevels.length) {
      damageIncrease = BladeDancer.dmgIncreaseLevels[BladeDancer.dmgIncreaseLevels.length - 1];
    } else {
      damageIncrease = BladeDancer.dmgIncreaseLevels[empowered];
    }
    console.log('calculateDamageIncrease', damageIncrease, empowered);
    return damageIncrease;
  }

  calculateDPS(boardConfig) {
    let damage = this.baseDamage;
    let speed = this.baseSpeed;
    
    this.damageIncrease = BladeDancer.calculateDamageIncrease(this.empowered);

    damage *= (1 + (this.damageIncrease / 100));

    // Adjusting speed if no adjacent BladeDancers
    if (this.neighbors === 0) {
      speed = speed / 2.5;
    }

    return super.baseCalculateDPS(boardConfig, speed, damage, undefined, undefined);
  }

  toObject() {
    const baseObject = super.toObject();
    return {
      ...baseObject,
      damageIncrease: this.damageIncrease,
      empowered: this.empowered
    };
  }
}

function BladeDancerComponent(props) {
  return (
    <div className="unit BladeDancer">
      <div className="unit-tooltip top-left">{props.unit.empowered}</div>
      <div className="unit-tooltip top-right" size="small">{BladeDancer.calculateDamageIncrease(props.unit.empowered)}%</div>
      <img src={BladeDancer.baseImage} width="70" alt="BladeDancer Unit" />
    </div>
  );
}

export { BladeDancer, BladeDancerComponent };
