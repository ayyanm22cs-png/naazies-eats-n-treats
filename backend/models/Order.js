import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },

    // 🔥 NEW: keep product reference for stock/capacity control
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    },

    cakeFlavor: { type: String, required: true },
    cakeWeight: { type: String, required: true },
    cakeMessage: { type: String },
    deliveryDate: { type: Date, required: true },
    totalPrice: { type: Number, default: 0 },

    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled']
    },

    orderType: {
        type: String,
        enum: ['Standard', 'Custom'],
        default: 'Standard'
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;