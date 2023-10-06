import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class Scrapper extends BaseUnit {
  static defaultImage = "scrapper.png";

  constructor(rateOfFire, damagePerHit) {
    super("Scrapper", rateOfFire, damagePerHit);
    this.component = ScrapperComponent;
  }

  // Additional methods specific to the Scrapper unit here
}

function ScrapperComponent(props) {
  return (
    <div className="unit Scrapper">
      <img src={Scrapper.baseImage} width="70" alt="Scrapper Unit" />
    </div>
  );
}

export { Scrapper, ScrapperComponent };