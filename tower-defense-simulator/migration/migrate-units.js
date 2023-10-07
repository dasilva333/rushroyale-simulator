let unitToFieldMapping = {};
let unitAndFieldSpecificMappings = require('./unitAndFieldSpecificMappings.json')
let fieldSpecific = unitAndFieldSpecificMappings.fieldSpecific;
let unitSpecific = unitAndFieldSpecificMappings.unitSpecific;

let cards = require('./old-units.js')
// Iterate over the keys of the cards object
Object.keys(cards).forEach(cardKey => {
    // For each card, iterate over its keys
    Object.keys(cards[cardKey]).forEach(fieldKey => {
        // Check if the fieldKey exists in the fieldSpecific object
        if (fieldSpecific[fieldKey]) {
            // If it does, add it to the unitToFieldMapping object
            if (!unitToFieldMapping[cardKey]) {
                unitToFieldMapping[cardKey] = [];
            }
            unitToFieldMapping[cardKey].push(fieldSpecific[fieldKey].property);
        }
    });
});

Object.keys(unitSpecific).forEach(unitKey => {
    if (unitToFieldMapping[unitKey]) {
        // Convert both arrays to Sets, merge them, then convert back to array
        let mergedSet = new Set([...unitToFieldMapping[unitKey], ...unitSpecific[unitKey]]);
        unitToFieldMapping[unitKey] = [...mergedSet];
    } else {
        // Otherwise, add a new entry
        unitToFieldMapping[unitKey] = unitSpecific[unitKey];
    }
});

// Now, unitToFieldMapping contains the merged data
console.log(unitToFieldMapping);
require('fs').writeFileSync('./unitToFieldMapping.json', JSON.stringify(unitToFieldMapping));
