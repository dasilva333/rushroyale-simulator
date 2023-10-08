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

  static getUnitBuffs(key, { tier, level }) {
    let buffValue = 0;
    if (key == "speed"){
      const minCardLevel = unitsService.levels[0];
      buffValue = (Banner.baseAttackSpeed + ((level - minCardLevel) * Banner.tierMultiplier)) * tier;
    }
    return buffValue;
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