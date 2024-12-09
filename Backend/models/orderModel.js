// models/orderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        // Remove required: true since we're auto-generating it
    },
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved'],
        default: 'Pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: null
    }
});

// Generate orderId before saving
orderSchema.pre('save', async function(next) {
    if (!this.orderId) {
        const count = await this.constructor.countDocuments() + 1;
        this.orderId = `ORD-${count.toString().padStart(3, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);