const fs = require('fs');
const path = require('path');

const UNIT_COMPONENTS_PATH = path.join(__dirname, 'src', 'components', 'UnitComponents');

const unitsList = [
  'Inquisitor', 'Boreas', 'Sentry', 'Cultist', 'Bladedancer', 'Crystalmancer', 'DemonHunter', 
  'Bruiser', 'Robot', 'Engineer', 'Monk', 'Generic', 'Banner', 'Dryad', 'Harly', 
  'Sword', 'Trapper', 'Chemist', 'Scrapper', 'Knight_Statue', 'Witch', 'Grindstone'
];

// Ensure the UnitComponents folder exists or create it
if (!fs.existsSync(UNIT_COMPONENTS_PATH)) {
  fs.mkdirSync(UNIT_COMPONENTS_PATH, { recursive: true });
}

unitsList.forEach(unitName => {
  createUnitFile(unitName);
});

function createUnitFile(unitName) {
  const fileName = `${unitName}.jsx`;
  const filePath = path.join(UNIT_COMPONENTS_PATH, fileName);

  const fileContent = `
import React from 'react';
import BaseUnit from '../../classes/BaseUnit';

class ${unitName} extends BaseUnit {
  static defaultImage = "${unitName.toLowerCase()}.png";

  constructor(rateOfFire, damagePerHit) {
    super("${unitName}", rateOfFire, damagePerHit);
    this.component = ${unitName}Component;
  }

  // Additional methods specific to the ${unitName} unit here
}

function ${unitName}Component(props) {
  return (
    <div className="unit ${unitName}">
      <img src={${unitName}.baseImage} width="70" alt="${unitName} Unit" />
    </div>
  );
}

export { ${unitName}, ${unitName}Component };
`;

  fs.writeFileSync(filePath, fileContent.trim());
}

console.log('Unit component files have been set up.');
