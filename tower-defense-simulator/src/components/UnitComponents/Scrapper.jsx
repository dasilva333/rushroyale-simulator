import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class Scrapper extends SupportUnit {
  static defaultImage = "scrapper.png";

  constructor(config) {
    super({
      name: "Scrapper",
      ...config
    });
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