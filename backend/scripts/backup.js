import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const collectionsToBackup = ['orders', 'products', 'categories'];

async function runBackup() {
    try {
        console.log('🚀 Initializing Pure Veg Database Backup...');
        await mongoose.connect(process.env.MONGO_URI);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFolder = path.join(process.cwd(), 'backups', `backup-${timestamp}`);

        if (!fs.existsSync(backupFolder)) {
            fs.mkdirSync(backupFolder, { recursive: true });
        }

        for (const modelName of collectionsToBackup) {
            const data = await mongoose.connection.db.collection(modelName).find({}).toArray();
            fs.writeFileSync(
                path.join(backupFolder, `${modelName}.json`),
                JSON.stringify(data, null, 2)
            );
            console.log(`✅ Saved ${data.length} records from ${modelName}`);
        }

        console.log(`📂 Full backup completed at: ${backupFolder}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Backup Failed:', error);
        process.exit(1);
    }
}

runBackup();