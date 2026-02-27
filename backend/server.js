import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();

// --- 1. HEALTH CHECK ---
app.get('/api/health', async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.status(dbStatus === 'Connected' ? 200 : 503).json({
        status: dbStatus === 'Connected' ? 'UP' : 'DOWN',
        database: dbStatus,
        uptime: `${Math.floor(process.uptime())}s`,
        timestamp: new Date().toISOString()
    });
});

// --- 2. GLOBAL SECURITY & MULTI-TIER RATE LIMITING ---
app.use(helmet());

// A. Relaxed Limiter: For Menu Browsing & Real-time Availability Syncing
const menuSyncLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 2000, // Allows 2000 requests per 5 mins per user
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Sync paused. Please wait a moment." }
});

// B. Strict Limiter: For Admin Login and Order Creation
const secureActionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, // Only 50 attempts for sensitive actions
    message: { message: "Too many attempts. Try again in 15 minutes." }
});

// Apply Tiered Security
app.use('/api/admin/login', secureActionLimiter);
app.use('/api/admin/orders/create', secureActionLimiter);
app.use('/api/admin/products', menuSyncLimiter);
app.use('/api/admin/categories', menuSyncLimiter);

// --- 3. SECURE CORS CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173',
    'https://naazies-eats-n-treats.vercel.app',
    'https://naazieseatsntreats.vercel.app'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS Policy Block'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// --- 4. DATABASE & ROUTES ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ Error:', err));

app.use('/api/admin', adminRoutes);
app.get('/', (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));