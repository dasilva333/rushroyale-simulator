const XLSX = require('xlsx');
const fs = require('fs');

// Function to parse the table data based on the starting row
function parseTable(startRow, data) {
  const headers = data[startRow].slice(4, 12);
  const tableData = {};
  const amountOfDataRows = parseInt(data[startRow - 1][1].split(',')[1]);

  for (let i = 0; i < amountOfDataRows; i++) {
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
  return tableData;
}

// General function to parse any unit sheet
function parseUnitSheet(sheetName) {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
    let unitJson = {
      "UnitInfo": {
        // ... (same as previously defined)
      },
      "Levels": {},
      "ManaLevels": {},
      "MergeRanks": {},
      "SpecialAbilities": {}
    };
  
    // Parse Levels
    unitJson.Levels = parseTable(6, data);
    // Parse ManaLevels
    unitJson.ManaLevels = parseTable(19, data);
    // Parse MergeRanks
    unitJson.MergeRanks = parseTable(27, data);
  
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
    "Demon Hunter",
    "Bruiser",
    "Blade Dancer",
    "Inquisitor",
    "Cultist",
    "Engineer",
    "Pyrotechnic",
    "Boreas",
    "Sentry",
    "Crystalmancer",
    "Robot",
    "Monk",
    "Banner",
    "Dryad",
    "Harlequin",
    "Enchanted Sword",
    "Trapper",
    "Chemist",
    "Scrapper",
    "Knight Statue",
    "Witch",
    "Grindstone"
  ];
  
// Iterate over the array of sheet names and parse each one
sheetNames.forEach(sheetName => {
  const unitJson = parseUnitSheet(sheetName);
  // Write JSON to a file named after the unit
  fs.writeFileSync(`${sheetName.toLowerCase()}.json`, JSON.stringify(unitJson, null, 2));
});
