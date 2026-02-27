import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This tells dotenv to look for the .env file in the PARENT folder (backend)
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        // Check if the URI is actually being loaded
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from your .env file!");
        }

        await mongoose.connect(process.env.MONGO_URI);

        const adminEmail = "azim@nazhat.com"; // Set your preferred email
        const adminPassword = "SecurePassword1234!"; // Set your preferred password

        const adminExists = await User.findOne({ email: adminEmail });
        if (adminExists) {
            console.log('Admin already exists!');
            process.exit();
        }

        await User.create({
            name: 'Naazie Admin',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        console.log('✅ Admin account created successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();