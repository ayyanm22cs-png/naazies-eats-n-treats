import User from '../models/User.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';

// ✅ IST DATE HELPER
const getISTDateString = () => {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
};

// --- DASHBOARD STATS ENGINE ---
export const getDashboardStats = async (req, res) => {
    try {
        const { mode, date } = req.query;

        let queryFilter = {};
        const filterDate = date ? new Date(date) : new Date();

        if (mode === 'daily') {
            const startOfDay = new Date(filterDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(filterDate);
            endOfDay.setHours(23, 59, 59, 999);
            queryFilter.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        const totalOrders = await Order.countDocuments(queryFilter);
        const pendingCakes = await Order.countDocuments({ ...queryFilter, status: 'Pending' });

        const revenueData = await Order.aggregate([
            { $match: { ...queryFilter, status: 'Completed' } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        const potentialData = await Order.aggregate([
            { $match: { ...queryFilter, status: { $in: ['Pending', 'Confirmed'] } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        const startOfSelectedDay = new Date(filterDate);
        startOfSelectedDay.setHours(0, 0, 0, 0);
        const endOfSelectedDay = new Date(filterDate);
        endOfSelectedDay.setHours(23, 59, 59, 999);

        const hourlyOrders = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfSelectedDay, $lte: endOfSelectedDay },
                    status: "Completed"
                }
            },
            {
                $group: {
                    _id: { $hour: "$createdAt" },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

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
            activeProducts: await Product.countDocuments({ status: 'Active' }),
            trajectoryChart
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

// --- AUTHENTICATION ---
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user && user.role === 'admin' && (await user.comparePassword(password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            const isProduction = process.env.NODE_ENV === "production";

            res.cookie('token', token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
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
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie('token', '', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        expires: new Date(0),
        path: '/'
    });

    res.status(200).json({ message: 'Logged out successfully' });
};

// --- ORDERS ---
export const createOrder = async (req, res) => {
    try {
        const { productId, orderType, deliveryDate } = req.body;

        if (orderType !== 'Custom' && productId) {
            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ message: "Product not found" });

            const nowIST = new Date(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
            );

            const selectedDate = new Date(deliveryDate);
            const todayIST = new Date(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
            );

            const isSameDay = (d1, d2) => {
                return (
                    d1.getFullYear() === d2.getFullYear() &&
                    d1.getMonth() === d2.getMonth() &&
                    d1.getDate() === d2.getDate()
                );
            };

            const isAfterCutoff = (cutoff) => {
                if (!cutoff) return false;

                const [cutHour, cutMinute] = cutoff.split(":").map(Number);
                const cutoffDate = new Date(nowIST);
                cutoffDate.setHours(cutHour, cutMinute, 0, 0);

                return nowIST >= cutoffDate;
            };

            const isTodayDelivery = isSameDay(selectedDate, todayIST);
            const isTimeClosed = isTodayDelivery && isAfterCutoff(product.cutoffTime);

            if (isTimeClosed) {
                return res.status(400).json({
                    message: "Same-day orders are closed for this cake. Please select a future delivery date."
                });
            }

            const todayString = getISTDateString();
            if (product.lastOrderDate !== todayString) {
                product.ordersToday = 0;
                product.lastOrderDate = todayString;
                await product.save();
            }

            if (!product.availableToday || product.ordersToday >= product.maxOrdersPerDay) {
                return res.status(400).json({ message: "Fully booked today" });
            }
        }

        const order = await Order.create({
            customerName: req.body.customerName,
            phone: req.body.phone,
            productId: req.body.productId || null,
            cakeFlavor: req.body.cakeFlavor,
            cakeWeight: req.body.cakeWeight,
            cakeMessage: req.body.cakeMessage || '',
            deliveryDate: req.body.deliveryDate,
            totalPrice: req.body.totalPrice || 0,
            orderType: req.body.orderType || 'Standard',
            status: 'Pending'
        });

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

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const previousStatus = order.status;

        if (order.orderType !== 'Custom' && order.productId) {
            const product = await Product.findById(order.productId);

            if (product) {
                const todayString = getISTDateString();

                if (product.lastOrderDate !== todayString) {
                    product.ordersToday = 0;
                    product.lastOrderDate = todayString;
                }

                if (previousStatus !== 'Confirmed' && status === 'Confirmed') {
                    if (!product.availableToday || product.ordersToday >= product.maxOrdersPerDay) {
                        return res.status(400).json({
                            message: "Cannot confirm order. Cake is fully booked today."
                        });
                    }

                    product.ordersToday += 1;
                    await product.save();
                }

                if (previousStatus === 'Confirmed' && status === 'Cancelled') {
                    product.ordersToday = Math.max(0, product.ordersToday - 1);
                    await product.save();
                }
            }
        }

        order.status = status;
        await order.save();

        res.json(order);

    } catch (error) {
        console.error("Status update failed:", error);
        res.status(500).json({ message: "Status update failed" });
    }
};

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

export const addProduct = async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : req.body.image;
        if (!imageUrl) return res.status(400).json({ message: 'Image required' });

        let variants = [];
        if (req.body.variants) {
            variants = JSON.parse(req.body.variants);
        }

        const product = await Product.create({
            ...req.body,
            variants,
            image: imageUrl
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create', error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Not found" });

        let updateData = { ...req.body };

        if (req.body.variants) {
            updateData.variants = JSON.parse(req.body.variants);
        }

        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: "Update failed", error: error.message });
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
    } catch {
        res.status(500).json({ message: "Failed" });
    }
};

export const updateAllProductsCutoff = async (req, res) => {
    try {
        const { cutoffTime } = req.body;

        if (!cutoffTime) {
            return res.status(400).json({ message: "Cutoff time is required" });
        }

        // ✅ Validate HH:MM format
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(cutoffTime)) {
            return res.status(400).json({ message: "Invalid cutoff time format. Use HH:MM" });
        }

        await Product.updateMany({}, { cutoffTime });

        res.json({ message: "Cutoff time updated for all products successfully" });
    } catch (error) {
        console.error("Global cutoff update failed:", error);
        res.status(500).json({ message: "Failed to update global cutoff time" });
    }
};