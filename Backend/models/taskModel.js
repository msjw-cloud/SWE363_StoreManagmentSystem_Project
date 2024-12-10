const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        enum: ['general', 'delivery'],
        default: 'general'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    deliveryStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipping', 'delivered'],
        default: 'pending'
    },
    // For delivery tasks
    orderDetails: {
        customerName: String,
        address: String,
        items: [{
            product: String,
            quantity: Number
        }]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);