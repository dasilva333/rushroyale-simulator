import React from 'react';
import BaseUnit from '../../classes/BaseUnit';
import PhaseLength from '../CommonStatsComponents/PhaseLength';

class Boreas extends BaseUnit {
  static defaultImage = "boreas.png";

  constructor(config) {
    super({
      name: "Boreas",
      ...config
    });
    this.component = BoreasComponent;
    this.statsComponent = BoreasStatsComponent;  // Assign the new stats component here
  }

  // Additional methods specific to the Boreas unit here
}

function BoreasComponent(props) {
  return (
    <div className="unit Boreas">
      <img src={Boreas.defaultImage} width="70" alt="Boreas Unit" />
    </div>
  );
}

function BoreasStatsComponent({ dpsInfo }) { // Pass the dpsInfo to the component
  return (
    <div>
      <PhaseLength dpsInfo={dpsInfo} />

      <strong>Normal Phase DPS</strong>:
      {dpsInfo.normalPhaseTotal / dpsInfo.mainDpsActivationInterval } for {dpsInfo.mainDpsFirstPhase}s

      <strong>First Phase DPS</strong>:
      {dpsInfo.firstPhaseTotal / dpsInfo.mainDpsFirstPhase} for {dpsInfo.mainDpsFirstPhase}s

      <strong>Second Phase DPS</strong>:
      {dpsInfo.secondPhaseTotal / dpsInfo.mainDpsSecondPhase} for {dpsInfo.mainDpsSecondPhase}s
    </div>
  );
}

export { Boreas, BoreasComponent, BoreasStatsComponent };  // Also export the new stats component
