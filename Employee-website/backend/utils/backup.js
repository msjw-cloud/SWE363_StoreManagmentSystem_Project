const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const backup = async () => {
    try {
        const date = new Date();
        const backupPath = path.join(__dirname, '../backups', 
            `backup-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`);

        const collections = ['products', 'orders', 'tasks', 'returns', 'users'];
        const backupData = {};

        for (const collectionName of collections) {
            const collection = mongoose.connection.collection(collectionName);
            backupData[collectionName] = await collection.find({}).toArray();
        }

        fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
        console.log(`Backup created at ${backupPath}`);
    } catch (err) {
        console.error('Backup failed:', err);
    }
};

module.exports = backup;