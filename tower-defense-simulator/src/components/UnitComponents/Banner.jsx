import React from 'react';
import SupportUnit from '../../classes/SupportUnit';
import unitsService from '../../data/unitsService';

class Banner extends SupportUnit {
  static defaultImage = "banner.png";
  static baseAttackSpeed = 12;
  static tierMultiplier = 0.5;

  constructor(config) {
    super({
      name: "Banner",
      ...config
    });
    this.component = BannerComponent;
  }

  static getSpeedBuff({ tier, level }) {
    const minCardLevel = unitsService.levels[0];
    const newAttackSpeed = (Banner.baseAttackSpeed + ((level - minCardLevel) * Banner.tierMultiplier)) * tier;
    return newAttackSpeed;
  }

  // The method to return the buff to its neighbors
  getBuffForNeighbor() {
    return {
      type: 'speed',
      value: this.getSpeedBuff()
    };
  }

  // Additional methods specific to the Banner unit here
}

function BannerComponent(props) {
  return (
    <div className="unit Banner">
      <img src={Banner.baseImage} width="70" alt="Banner Unit" />
    </div>
  );
}

export { Banner, BannerComponent };