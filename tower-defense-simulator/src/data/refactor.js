const fs = require('fs');

// Read the file
const data = JSON.parse(fs.readFileSync('./unitConfiguration.json', 'utf-8'));

// Function to refactor the key name
const refactorKeyName = (key) => {
    if (key.startsWith('mainDps')) {
        return key.replace('mainDps', '').charAt(0).toLowerCase() + key.slice(8);
    }
    return key;
};

// Iterate over each unit in the data
for (const unit in data) {
    // Check fields array
    if (data[unit].fields) {
        data[unit].fields = data[unit].fields.map(refactorKeyName);
    }

    // Check defaults object
    if (data[unit].defaults) {
        for (const key in data[unit].defaults) {
            if (key.startsWith('mainDps')) {
                const newKey = refactorKeyName(key);
                data[unit].defaults[newKey] = data[unit].defaults[key];
                delete data[unit].defaults[key];
            }
        }
    }
}

// Write the refactored data back to the file
fs.writeFileSync('./unitConfiguration2.json', JSON.stringify(data, null, 2));

console.log('File has been refactored successfully!');
