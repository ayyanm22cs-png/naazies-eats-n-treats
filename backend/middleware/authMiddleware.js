import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token = req.cookies.token;

    if (token) {
        try {
            // 1. Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 2. Get user from the token, but exclude password
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User no longer exists' });
            }

            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error.message);
            res.status(401).json({ message: 'Not authorized, session expired or invalid' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, please login' });
    }
};

export const admin = (req, res, next) => {
    // Check if user is logged in AND has the admin role
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
};