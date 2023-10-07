import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class Banner extends SupportUnit {
  static defaultImage = "banner.png";

  constructor(config) {
    super({
      name: "Banner",
      ...config
    });
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