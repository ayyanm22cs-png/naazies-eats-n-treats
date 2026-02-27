import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    size: { type: String, required: true },
    image: { type: String },

    // Availability system
    availableToday: { type: Boolean, default: true },
    maxOrdersPerDay: { type: Number, default: 5 },
    advanceHoursRequired: { type: Number, default: 24 },

    // 🔥 ORDER INTELLIGENCE
    ordersToday: { type: Number, default: 0 },
    lastOrderDate: { type: String }, // format: YYYY-MM-DD

    // 🕒 ORDER TIME CONTROL (NEW)
    cutoffTime: {
        type: String,
        default: "18:00" // 6 PM default order closing time
    },

    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }

}, { timestamps: true });

export default mongoose.model('Product', productSchema);