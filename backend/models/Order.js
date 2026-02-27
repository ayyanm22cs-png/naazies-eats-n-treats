import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    cakeFlavor: { type: String, required: true },
    cakeWeight: { type: String, required: true },
    cakeMessage: { type: String },
    deliveryDate: { type: Date, required: true },
    totalPrice: { type: Number, default: 0 }, // For custom orders, Admin can set this later
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled']
    },
    // 🔥 NEW FIELD
    orderType: {
        type: String,
        enum: ['Standard', 'Custom'],
        default: 'Standard'
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;