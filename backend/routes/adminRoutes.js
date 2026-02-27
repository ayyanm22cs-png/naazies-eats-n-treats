import express from 'express';
import {
    loginAdmin, logoutAdmin, getAdminOrders, createOrder, updateOrderStatus, updateOrderPrice,
    getCategories, addCategory, deleteCategory, updateCategory, getDashboardStats,
    getProducts, addProduct, deleteProduct, toggleProductStatus, updateProduct, toggleAvailability
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public Routes (No protect/admin needed for login or creating orders from web)
router.post('/login', loginAdmin);
router.post('/orders/create', createOrder); // 🔥 THIS LINE FIXES THE 404

// Admin Protected Routes
router.post('/logout', logoutAdmin);
router.get('/orders', protect, admin, getAdminOrders);
router.patch('/orders/:id/status', protect, admin, updateOrderStatus);
router.patch('/orders/:id/price', protect, admin, updateOrderPrice);

router.get('/categories', getCategories);
router.post('/categories', protect, admin, addCategory);
router.put('/categories/:id', protect, admin, updateCategory);
router.delete('/categories/:id', protect, admin, deleteCategory);

router.get('/products', getProducts);
router.post('/products', protect, admin, upload.single('image'), addProduct);
router.delete('/products/:id', protect, admin, deleteProduct);
router.patch('/products/:id/status', protect, admin, toggleProductStatus);
router.put('/products/:id', protect, admin, upload.single('image'), updateProduct);
router.patch('/products/:id/availability', protect, admin, toggleAvailability);

router.get('/stats', protect, admin, getDashboardStats);

export default router;