const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('./Unit stats (22.0) - from Oct 27, 2023.xlsx');

// Function to parse the Bruiser sheet
function parseBruiser() {
    const worksheet = workbook.Sheets['Bruiser'];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Here you would parse the rows and columns based on their meaning
    // For simplicity, let's assume the first few rows contain the UnitInfo and
    // subsequent rows contain Levels, ManaLevels, etc., in a predictable format

    let bruiserJson = {
        "UnitInfo": {
            // Extracted from the first few rows
        },
        "Levels": {
            // Extracted from a specific section of the sheet
        },
        "ManaLevels": {
            // Extracted from a specific section of the sheet
        },
        "MergeRanks": {
            // Extracted from a specific section of the sheet
        },
        "Enraged": {
            // Extracted from a specific section of the sheet
        },
        "SpecialAbilities": {
            // Extracted from a specific section of the sheet
        }
    };

    // Example of how you might extract UnitInfo
    // Assuming 'data' is an array of arrays representing rows and columns from the 'Bruiser' sheet
    bruiserJson.UnitInfo = {
        "Name": data[0][1],        // Bruiser
        "Rarity": data[1][1],      // Legendary
        "Faction": data[2][1],     // Magic Council
        "UnitType": data[3][1],    // Damage
        "Target": data[4][1],      // First
        "Arena": data[5][1],       // 7
        "AoE": data[6][1],         // Enraged
        "Lv": data[9][1],          // 7,15
        "Mana Lv": data[10][1],     // 1,5
        "Merge Rank": data[11][1], // 1,7
        "Attributes": data[12][1]  // 7
      };
      
      // Let's assume we've parsed the headers and base stats for the ManaLevels section
      // based on your guidance, starting from row 19 (index 18)
      
      const manaLevelsHeaders = data[18].slice(5, 12); // E19 to L19
      const manaLevelsBaseStats = data[19].slice(4, 12); // E20 to L20
      
      // Initialize ManaLevels with Base stats
      bruiserJson.ManaLevels = {
        "Base": {}
      };
      
      // Fill in the base stats for ManaLevels
      manaLevelsHeaders.forEach((header, index) => {
        const statName = header.trim(); // Assuming headers might have extra whitespace
        const baseStatValue = manaLevelsBaseStats[index];
        bruiserJson.ManaLevels.Base[statName] = baseStatValue;
      });
      
      const manaLevelsAmount = bruiserJson.UnitInfo["Mana Lv"].split(',')[1];
      console.log('manaLevelsHeaders', manaLevelsHeaders);
      // Now you would process the 5 rows of data for each mana level
      // Assuming the rows for mana level 1 start at index 20 (row 21 in the sheet)
      for (let i = 0; i < parseInt(manaLevelsAmount); i++) {
        const levelData = data[20 + i].slice(5, 12); // F21 to L21 and so on for each level
        console.log('levelData', levelData, i);
        const level = (i + 1).toString(); // Mana level
      
        bruiserJson.ManaLevels[level] = {};
        manaLevelsHeaders.forEach((header, index) => {
          const statName = header.trim();
          const statValue = levelData[index];
          bruiserJson.ManaLevels[level][statName] = statValue;
        });
      }      


    // You would continue with a similar approach for Levels, ManaLevels, etc.
    // The details of this will depend on the exact layout of your sheet

    return bruiserJson;
}

// Convert and get the JSON data for Bruiser
const bruiserJson = parseBruiser();

// Write JSON to a file
fs.writeFileSync('bruiser.json', JSON.stringify(bruiserJson, null, 2));
