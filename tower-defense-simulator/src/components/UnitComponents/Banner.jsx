import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Banner extends BaseUnit {
  static defaultImage = "banner.png";

  constructor(rateOfFire, damagePerHit) {
    super("Banner", rateOfFire, damagePerHit);
    this.component = BannerComponent;
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