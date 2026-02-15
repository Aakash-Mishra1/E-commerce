const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: String },
            quantity: { type: Number, default: 1 },
            name: String,
            price: Number,
            image: String
        }
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: 'pending' },
    paymentInfo: {
        id: String,
        status: String,
        method: String,
        receipt: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
