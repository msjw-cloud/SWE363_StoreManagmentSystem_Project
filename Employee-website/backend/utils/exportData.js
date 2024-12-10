const json2csv = require('json2csv').parse;
const fs = require('fs');
const path = require('path');

class DataExporter {
    static async exportToCsv(data, fields, filename) {
        try {
            const csv = json2csv(data, { fields });
            const filepath = path.join(__dirname, '../exports', filename);
            fs.writeFileSync(filepath, csv);
            return filepath;
        } catch (err) {
            throw new Error('Export failed: ' + err.message);
        }
    }

    static async exportToExcel(data, filename) {
        // Implementation for Excel export
    }
}

module.exports = DataExporter;