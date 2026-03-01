import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },

    // 🔥 DYNAMIC VARIANTS SYSTEM
    variants: [{
        sizeName: { type: String, required: true }, // e.g. "1/2 Kg"
        serves: { type: String },                   // e.g. "4-5 People"
        price: { type: Number, required: true },    // e.g. 450
        stock: { type: Number, default: 10 }
    }],

    availableToday: { type: Boolean, default: true },
    maxOrdersPerDay: { type: Number, default: 5 },
    ordersToday: { type: Number, default: 0 },
    lastOrderDate: { type: String },
    cutoffTime: { type: String, default: "18:00" },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);