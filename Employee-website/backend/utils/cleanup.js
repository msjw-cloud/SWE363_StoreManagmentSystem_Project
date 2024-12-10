const fs = require('fs');
const path = require('path');

class CleanupUtil {
    static async cleanupOldFiles(directory, maxAge) {
        const files = fs.readdirSync(directory);
        const now = Date.now();

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);
            const age = now - stats.mtimeMs;

            if (age > maxAge) {
                fs.unlinkSync(filePath);
            }
        }
    }

    static async cleanupOldRecords(model, field, maxAge) {
        const cutoffDate = new Date(Date.now() - maxAge);
        await model.deleteMany({ [field]: { $lt: cutoffDate } });
    }
}

module.exports = CleanupUtil;