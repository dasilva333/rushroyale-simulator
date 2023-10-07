const fs = require('fs');
const path = require('path');

const UNIT_COMPONENTS_PATH = path.join(__dirname, 'src', 'components', 'UnitComponents');

const unitsList = [
  'Inquisitor', 'Boreas', 'Sentry', 'Cultist', 'Bladedancer', 'Crystalmancer', 'DemonHunter', 
  'Bruiser', 'Robot', 'Engineer', 'Monk', 'Generic', 'Banner', 'Dryad', 'Harly', 
  'Sword', 'Trapper', 'Chemist', 'Scrapper', 'Knight_Statue', 'Witch', 'Grindstone'
];

const supportUnits = ['banner', 'dryad', 'harly', 'sword', 'trapper', 'chemist', 'scrapper', 'knight_statue', 'grindstone'];

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
  
  const parentClass = supportUnits.includes(unitName.toLowerCase()) ? 'SupportUnit' : 'BaseUnit';

  const fileContent = `
import React from 'react';
import ${parentClass} from '../../classes/${parentClass}';

class ${unitName} extends ${parentClass} {
  static defaultImage = "${unitName.toLowerCase()}.png";

  constructor(config) {
    super({
      name: "${unitName}",
      ...config
    });
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
