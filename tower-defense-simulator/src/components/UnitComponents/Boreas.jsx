import React from 'react';
import DPSUnit from '../../classes/DPSUnit';
import PhaseLength from '../CommonStatsComponents/PhaseLength';

class Boreas extends DPSUnit {
  static defaultImage = "boreas.png";
  static damageIncreaseSteps = 10;  // Placeholder, adjust if needed
  static baseDamage = 120;
  static baseSpeed = 0.09;
  static baseCrit = 0;
  static firstPhase = 4.6;
  static secondPhase = 1.7;
  static activationInterval = 4.7;
  static speedTiers = {
    1: 0,
    2: 0.3,
    3: 0.4,
    4: 0.45,
    5: 0.48,
    6: 0.5,
    7: 0.51
  };
  static damageLevels = {
    7: 100,
    8: 103,
    9: 107,
    10: 111,
    11: 116,
    12: 122,
    13: 128,
    14: 136,
    15: 145
  };

  constructor(config) {
    super({
      name: "Boreas",
      ...config
    });
    this.component = BoreasComponent;
    this.statsComponent = BoreasStatsComponent;  // Assign the new stats component here
  }


  calculateDPS(boardConfig) {
    const normalPhaseDPS = super.baseCalculateDPS(boardConfig);
    const normalPhaseTotal = normalPhaseDPS.total * Boreas.activationInterval;

    const firstPhaseDPS = super.baseCalculateDPS(boardConfig, Boreas.baseSpeed / 7);
    const firstPhaseTotal = firstPhaseDPS.total * Boreas.firstPhase;

    const secondPhaseDPS = super.baseCalculateDPS(boardConfig, Boreas.baseSpeed / 7, undefined, 100);
    const secondPhaseTotal = secondPhaseDPS.total * Boreas.secondPhase;

    const totalPhaseLengthSeconds = Boreas.activationInterval + Boreas.firstPhase + Boreas.secondPhase;
    const totalDamage = Math.floor((normalPhaseTotal + firstPhaseTotal + secondPhaseTotal) / totalPhaseLengthSeconds);

    return {
      total: totalDamage,
      normalPhaseTotal,
      firstPhaseTotal,
      secondPhaseTotal,
      totalPhaseLengthSeconds
    };
  }
}

function BoreasComponent(props) {
  return (
    <div className="unit Boreas">
      <img src={Boreas.baseImage} width="70" alt="Boreas Unit" />
    </div>
  );
}

function BoreasStatsComponent({ dpsInfo }) {
  return (
    <div>
      <PhaseLength dpsInfo={dpsInfo} />

      <strong>Normal Phase DPS</strong>:
      {dpsInfo.normalPhaseTotal / dpsInfo.activationInterval } for {dpsInfo.firstPhase}s

      <strong>First Phase DPS</strong>:
      {dpsInfo.firstPhaseTotal / dpsInfo.firstPhase} for {dpsInfo.firstPhase}s

      <strong>Second Phase DPS</strong>:
      {dpsInfo.secondPhaseTotal / dpsInfo.secondPhase} for {dpsInfo.secondPhase}s
    </div>
  );
}

export { Boreas, BoreasComponent, BoreasStatsComponent };
