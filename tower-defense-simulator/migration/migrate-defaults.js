const fs = require('fs');

// Load our configurations and data
const fieldToComponentSpec = require('./fieldToComponentSpec.json');
const oldUnits = require('./old-units.js');

// Process the old units' data and determine defaults
const getUnitDefaults = () => {
    const unitDefaults = {};

    Object.keys(oldUnits).forEach(unitName => {
        unitDefaults[unitName] = {};

        Object.keys(fieldToComponentSpec).forEach(fieldName => {
            const spec = fieldToComponentSpec[fieldName];

            // If the unit has this field and either isNullable is set to false or it has no default value, we set the unit's value.
            if (oldUnits[unitName][fieldName] !== undefined && (spec.isNullable === false || !spec.defaultValue)) {
                unitDefaults[unitName][fieldName] = oldUnits[unitName][fieldName];
            }
        });
    });

    return unitDefaults;
};

const unitDefaults = getUnitDefaults();

// Write the new configuration to a file
fs.writeFileSync('./unitDefaults.json', JSON.stringify(unitDefaults, null, 2));

console.log('unitDefaults.json generated!');
