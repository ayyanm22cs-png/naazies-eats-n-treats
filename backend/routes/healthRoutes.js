import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // 1. Check Database connection
        const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';

        // 2. Performance Metric
        const uptime = process.uptime();

        const healthStatus = {
            status: 'UP',
            database: dbStatus,
            uptime: `${Math.floor(uptime)} seconds`,
            timestamp: new Date().toISOString()
        };

        if (dbStatus !== 'Connected') {
            return res.status(503).json(healthStatus);
        }

        res.status(200).json(healthStatus);
    } catch (error) {
        res.status(500).json({ status: 'DOWN', error: error.message });
    }
});

export default router;