const unitToFieldMapping = require('./unitToFieldMapping.json')
// 1. Merge all arrays to extract unique fields
let allFields = [];
for (let unit in unitToFieldMapping) {
    allFields = allFields.concat(unitToFieldMapping[unit]);
}

let uniqueFields = [...new Set(allFields)];

// 2. Map each unique field to its component spec
let fieldToComponentSpec = {};

uniqueFields.forEach(field => {
    fieldToComponentSpec[field] = getComponentSpecForField(field);
});

function getComponentSpecForField(field) {
    // This function returns the component spec based on the field.

    // Handle level field
    if (field === "level") {
        return {
            componentType: "select",
            options: "unitsService.levels",
            min: "unitsService.levels[0]",
            max: "unitsService.levels[unitsService.levels.length-1]"
        };
    }
    // Handle critDamage field
    else if (field === "critDamage") {
        return { componentType: "input", inputType: "number" };
    }
    // Handle specific fields for inquisitor and similar units
    else if (["mainDpsBaseDamage", "mainDpsBaseSpeed", "mainDpsBaseCrit", "absorbs", "mainDpsDamageIncrease", "tier"].includes(field)) {
        return { componentType: "input", inputType: "number" };
    }
    else if (["talent", "activeTalents"].includes(field)) {
        return {
            componentType: "select",
            options: "unitsService.talents"
        };
    }
    else if (field === "demonHunterEmpowered" || field === "enraged" || field === "isActivated") {
        return {
            componentType: "checkbox"
        };
    }
    else if (field === "merges") {
        return {
            componentType: "input",
            inputType: "number",
            min: 0
            // potentially add a max property based on each unit's max merges
        };
    }
    else if (["name", "heroTile"].includes(field)) {
        return {
            componentType: "input",
            inputType: "text"
        };
    }
    else if (field === "mainDpsFirstPhase" || field === "mainDpsSecondPhase" || field === "mainDpsActivationInterval") {
        return {
            componentType: "input",
            inputType: "number",
            label: "Duration" // You can adjust the label for each one if necessary
        };
    }
    else if (field === "sacrifices") {
        return {
            componentType: "input",
            inputType: "number",
            label: "Sacrifices"
        };
    }
    else if (field === "damage") {
        return {
            componentType: "input",
            inputType: "number",
            label: "Base Damage Buff"
        };
    }
    else if (field === "swordStacks") {
        return {
            componentType: "select",
            options: "cardMerges(unitsService.cards.sword)",
            label: "Sword Stacks"
        };
    }
    else if (field === "swordLevel") {
        return {
            componentType: "select",
            options: "unitsService.levels",
            label: "Sword Level",
            min: "unitsService.levels[0]",
            max: "unitsService.levels[unitsService.levels.length-1]"
        };
    }
    else if (["second_breath", "doublet", "precise_shooting"].includes(field)) {
        return {
            componentType: "checkbox",
            label: field.replace("_", " ").charAt(0).toUpperCase() + field.slice(1) // This will convert a field like 'second_breath' to 'Second breath'. Adjust as needed.
        };
    }    
    // For fields not explicitly defined, we return a generic text input as the default
    else {
        console.log('unknown field detected', field);
        return { componentType: "input", inputType: "text" };
    }
}

console.log(fieldToComponentSpec);
require('fs').writeFileSync('./fieldToComponentSpec.json', JSON.stringify(fieldToComponentSpec, null, 4));
