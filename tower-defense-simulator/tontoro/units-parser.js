const XLSX = require('xlsx');
const fs = require('fs');

// Function to parse the table data based on the starting row
function parseTable(startRow, data, unitJson) {
    const headers = data[startRow].slice(5, 12);
    const tableType = data[startRow + 1][4];
    // console.log('tableType', tableType);
    const tableData = {};
    const amountOfDataRows = unitJson.UnitInfo[tableType].split(",");
    const totalRows = amountOfDataRows[1] - amountOfDataRows[0];

    for (let i = 0; i < totalRows; i++) {
        const rowData = data[startRow + 1 + i].slice(5, 12);
        const level = (i + 1).toString();
        tableData[level] = {};
        headers.forEach((header, index) => {
            if (header) {
                const statName = header.trim();
                const statValue = rowData[index];
                tableData[level][statName] = statValue;
            }
        });
    }
    // console.log('tableData', tableData);
    return tableData;
}

// General function to parse any unit sheet
function parseUnitSheet(sheetName) {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    let unitJson = {
  "UnitInfo": {
      "Name": data[0][1],
      "Rarity": data[1][1],
      "Faction": data[2][1],
      "UnitType": data[3][1],
      "Target": data[4][1],
      "Arena": data[5][1],
      "AoE": data[6][1],
      "Lv": data[9][1],
      "Mana Lv": data[10][1],
      "Merge Rank": data[11][1],
      "Attributes": data[12][1]
    },
        "Levels": {},
        "ManaLevels": {},
        "MergeRanks": {},
        "SpecialAbilities": {}
    };

    // console.log('data', data);
    // console.log('unitJson', unitJson);

    // Parse Levels
    unitJson.Levels = parseTable(6, data, unitJson);
    // // Parse ManaLevels
    unitJson.ManaLevels = parseTable(18, data, unitJson);
    // // Parse MergeRanks
    unitJson.MergeRanks = parseTable(26, data, unitJson);

    // Unit specific parsing based on the sheet name
    switch (sheetName) {
        case 'Bruiser':
            // Add any specific parsing for Bruiser here
            unitJson.SpecialAbilities['Enraged'] = {}; // Placeholder for Enraged data
            // Populate the Enraged data...
            break;
        // Add more cases for other units with special parsing requirements
        default:
            break;
    }

    return unitJson;
}

// Read the Excel file
const workbook = XLSX.readFile('./Unit stats (22.0) - from Oct 27, 2023.xlsx');

// Define an array of sheet names to parse
const sheetNames = [
    "Bruiser",
    "Demon Hunter",
    "Blade Dancer",
    "Inquisitor",
    "Cultist",
    // "Engineer",
    // "Pyrotechnic",
    "Boreas",
    // "Sentry",
    // "Crystalmancer",
    "Robot",
    "Monk",
    // "Banner",
    "Dryad",
    "Harlequin",
    "Enchanted Sword",
    "Trapper",
    // "Chemist",
    "Scrapper",
    "Knight Statue",
    "Witch",
    // "Grindstone"
];

// Iterate over the array of sheet names and parse each one
sheetNames.forEach(sheetName => {
    console.log('parsing', sheetName);
    const unitJson = parseUnitSheet(sheetName);
    // Write JSON to a file named after the unit
    fs.writeFileSync(`${sheetName.toLowerCase()}.json`, JSON.stringify(unitJson, null, 2));
});
