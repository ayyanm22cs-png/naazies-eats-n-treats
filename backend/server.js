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

// --- 1. HEALTH CHECK (Public Endpoint) ---
// This allows Render or UptimeRobot to monitor the server and database status
app.get('/api/health', async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.status(dbStatus === 'Connected' ? 200 : 503).json({
        status: dbStatus === 'Connected' ? 'UP' : 'DOWN',
        database: dbStatus,
        uptime: `${Math.floor(process.uptime())}s`,
        timestamp: new Date().toISOString()
    });
});

// --- 2. GLOBAL SECURITY MIDDLEWARE ---
// Helmet sets secure HTTP headers to prevent XSS and Clickjacking
app.use(helmet());

// Rate limiting to prevent brute-force attacks on your Pure Veg cake data
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." }
});
// Apply limiter to all API routes except health checks
app.use('/api/admin', limiter);

// --- 3. SECURE CORS CONFIGURATION ---
// Restricts API access to your verified Vercel domains
const allowedOrigins = [
    'http://localhost:5173',
    'https://naazies-eats-n-treats.vercel.app',
    'https://naazieseatsntreats.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like your automated backup scripts)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS Policy Block: Unauthorized Origin'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- 4. STANDARD MIDDLEWARE ---
app.use(express.json());
app.use(cookieParser());

// --- 5. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- 6. ROUTES ---
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send("Naazie's Eats & Treats API is shielded, limited, and running...");
});

// --- 7. SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Secure Admin API running on port ${PORT}`);
});