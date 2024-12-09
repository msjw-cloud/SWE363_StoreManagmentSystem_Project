// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

// Get all orders (separate pending and approved)
router.get('/', async (req, res) => {
    try {
        const pendingOrders = await Order.find({ status: 'Pending' })
            .populate('assignedTo', 'name');
        const approvedOrders = await Order.find({ status: 'Approved' })
            .populate('assignedTo', 'name');
        
        res.json({
            pendingOrders,
            approvedOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        const order = new Order({
            product: req.body.product,
            quantity: req.body.quantity,
            date: req.body.date || new Date(),
            status: 'Pending'
        });
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Approve order
router.put('/:id/approve', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        order.status = 'Approved';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Assign order to employee
router.put('/:id/assign', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        order.assignedTo = req.body.employeeId;
        const updatedOrder = await order.save();
        
        const populatedOrder = await Order.findById(updatedOrder._id)
            .populate('assignedTo', 'name');
            
        res.json(populatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;