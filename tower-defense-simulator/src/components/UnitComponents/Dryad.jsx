import React from 'react';
import SupportUnit from '../../classes/SupportUnit';

class Dryad extends SupportUnit {
  static defaultImage = "dryad.png";
  static buffPerMerge = 2.5;

  constructor(config) {
    super({
      name: "Dryad",
      ...config
    });
    this.merges = config.merges;
    this.component = DryadComponent;
  }

  static getGlobalBuffs(buffType, hydratedGlobalUnit) {
    if (buffType === 'damage') {
      const merges = hydratedGlobalUnit.merges || 0;
      console.log('calculating global damage buff with dryad, merges:', merges);
      return merges * this.buffPerMerge;
    }
    return 0; // Return 0 if the buffType doesn't match any known buffs
  }

    // Additional methods specific to the Witch unit here
    toObject() {
      // Grab the serialized properties from the parent class
      const baseObject = super.toObject();
  
      // Return the merged object
      return {
        ...baseObject,
        merges: this.merges
      };
    }
}

function DryadComponent(props) {
  return (
    <div className="unit Dryad">
      <div className="unit-tooltip top-left">{props.unit.merges}</div>
      <img src={Dryad.baseImage} width="70" alt="Dryad Unit" />
    </div>
  );
}

export { Dryad, DryadComponent };
