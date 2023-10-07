const fs = require('fs');

// Read the JSON files
const unitToFieldMapping = require('./unitToFieldMapping.json');
const unitDefaults = require('./unitDefaults.json');

// Merge the datasets
let mergedData = {};

for (let unit in unitToFieldMapping) {
    mergedData[unit] = {
        fields: unitToFieldMapping[unit],
        defaults: unitDefaults[unit] || {}
    };
}

// Write the merged data to a new file
fs.writeFileSync('unitConfiguration.json', JSON.stringify(mergedData, null, 2), 'utf-8');

console.log("Merged data written to 'unitConfiguration.json'.");
