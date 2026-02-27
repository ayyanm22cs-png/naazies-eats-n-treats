import User from '../models/User.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';

// --- DASHBOARD STATS ENGINE ---
export const getDashboardStats = async (req, res) => {
    try {
        const { mode, date } = req.query; //

        // Build the filter based on mode
        let queryFilter = {};
        const filterDate = date ? new Date(date) : new Date(); //

        if (mode === 'daily') {
            const startOfDay = new Date(filterDate);
            startOfDay.setHours(0, 0, 0, 0); //
            const endOfDay = new Date(filterDate);
            endOfDay.setHours(23, 59, 59, 999); //
            queryFilter.createdAt = { $gte: startOfDay, $lte: endOfDay }; //
        }

        const totalOrders = await Order.countDocuments(queryFilter); //
        const pendingCakes = await Order.countDocuments({ ...queryFilter, status: 'Pending' }); //

        const revenueData = await Order.aggregate([
            { $match: { ...queryFilter, status: 'Completed' } }, //
            { $group: { _id: null, total: { $sum: "$totalPrice" } } } //
        ]);

        const potentialData = await Order.aggregate([
            { $match: { ...queryFilter, status: { $in: ['Pending', 'Confirmed'] } } }, //
            { $group: { _id: null, total: { $sum: "$totalPrice" } } } //
        ]);

        // 🔥 HOURLY ORDER TRAJECTORY (For the selected date)
        const startOfSelectedDay = new Date(filterDate);
        startOfSelectedDay.setHours(0, 0, 0, 0); //
        const endOfSelectedDay = new Date(filterDate);
        endOfSelectedDay.setHours(23, 59, 59, 999); //

        const hourlyOrders = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfSelectedDay, $lte: endOfSelectedDay },
                    status: "Completed" //
                }
            },
            {
                $group: {
                    _id: { $hour: "$createdAt" }, // Group by UTC hour
                    count: { $sum: 1 }, // 🔥 Count of orders per hour
                    revenue: { $sum: "$totalPrice" } // Still keeping revenue for potential use
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Initialize 24-hour array with AM/PM formatting
        const trajectoryChart = Array.from({ length: 24 }, (_, i) => {
            const displayHour = i === 0 ? 12 : i > 12 ? i - 12 : i;
            const ampm = i >= 12 ? 'PM' : 'AM';
            return {
                hour: `${i}:00`,
                count: 0,
                revenue: 0,
                fullTime: `${displayHour}:00 ${ampm}`
            };
        });

        // Fill data from DB
        hourlyOrders.forEach(item => {
            if (trajectoryChart[item._id]) {
                trajectoryChart[item._id].count = item.count;
                trajectoryChart[item._id].revenue = item.revenue;
            }
        });

        res.json({
            totalOrders,
            pendingCakes,
            totalRevenue: revenueData.length ? revenueData[0].total : 0,
            potentialRevenue: potentialData.length ? potentialData[0].total : 0,
            activeProducts: await Product.countDocuments({ status: 'Active' }), //
            trajectoryChart
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message }); //
    }
};

// --- AUTHENTICATION ---
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user && user.role === 'admin' && (await user.comparePassword(password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            // 🔥 DYNAMIC COOKIE CONFIG
            const isProduction = process.env.NODE_ENV === "production";

            res.cookie('token', token, {
                httpOnly: true,
                secure: isProduction, // True on Render/Vercel, False on Local
                sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site prod, 'lax' for local
                maxAge: 24 * 60 * 60 * 1000,
                path: '/'
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(401).json({ message: 'Invalid admin credentials' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const logoutAdmin = async (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0), path: '/' });
    res.status(200).json({ message: 'Logged out successfully' });
};

// --- ORDERS ---
export const createOrder = async (req, res) => {
    try {
        const { productId, orderType } = req.body;

        // If it's a standard order, we check product availability
        if (orderType !== 'Custom' && productId) {
            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ message: "Product not found" });

            const today = new Date().toISOString().split("T")[0];
            if (product.lastOrderDate !== today) {
                product.ordersToday = 0;
                product.lastOrderDate = today;
            }

            if (!product.availableToday || product.ordersToday >= product.maxOrdersPerDay) {
                return res.status(400).json({ message: "Fully booked today" });
            }

            product.ordersToday += 1;
            await product.save();
        }

        // Create the order (Works for both Standard and Custom)
        const order = await Order.create(req.body);
        res.status(201).json(order);
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(400).json({ message: "Order failed", error: error.message });
    }
};

export const getAdminOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        order.status = status;
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Status update failed" });
    }
};

// Add this to your adminController.js
export const updateOrderPrice = async (req, res) => {
    try {
        const { totalPrice } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: "Order not found" });

        order.totalPrice = totalPrice;
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Price update failed" });
    }
};

// --- CATEGORIES ---
export const getCategories = async (req, res) => {
    try {
        const cats = await Category.find({});
        res.json(cats);
    } catch (error) { res.status(500).json({ message: 'Error' }); }
};

export const addCategory = async (req, res) => {
    try {
        const category = await Category.create({ name: req.body.name });
        res.status(201).json(category);
    } catch (error) { res.status(400).json({ message: 'Failed' }); }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        res.json(category);
    } catch (error) { res.status(400).json({ message: 'Update failed' }); }
};

export const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ message: 'Failed' }); }
};

// --- PRODUCTS ---
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) { res.status(500).json({ message: 'Error' }); }
};

// --- PRODUCTS ---
export const addProduct = async (req, res) => {
    try {
        // 🔥 Logic: Use Cloudinary path if file exists, otherwise take the URL from body
        const imageUrl = req.file ? req.file.path : req.body.image;

        if (!imageUrl) {
            return res.status(400).json({ message: 'Please provide an image file or a valid URL' });
        }

        const product = await Product.create({
            ...req.body,
            image: imageUrl
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create product', error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Not found" });

        // Update fields from body
        Object.assign(product, req.body);

        // 🔥 Update image: priority to new file upload, then body URL string
        if (req.file) {
            product.image = req.file.path;
        } else if (req.body.image) {
            product.image = req.body.image;
        }

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: "Failed to update product", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ message: 'Failed' }); }
};

export const toggleProductStatus = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        product.status = product.status === 'Active' ? 'Inactive' : 'Active';
        await product.save();
        res.json(product);
    } catch (error) { res.status(500).json({ message: 'Failed' }); }
};

export const toggleAvailability = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        product.availableToday = !product.availableToday;
        await product.save();
        res.json(product);
    } catch { res.status(500).json({ message: "Failed" }); }
};