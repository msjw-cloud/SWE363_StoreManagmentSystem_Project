const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const Category = require('../models/productModel'); // Add this line to directly import the Category model
const jwt = require('jsonwebtoken');

// Middleware stays the same
const authenticateCustomer = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'customer') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Get cart items
router.get('/', authenticateCustomer, async (req, res) => {
    try {
        let cart = await Cart.findOne({ customer: req.user.userId })
                            .populate('items.product');
        
        if (!cart) {
            cart = new Cart({ customer: req.user.userId, items: [] });
            await cart.save();
        }
        
        res.json(cart);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Add item to cart - Modified to use Category model directly
router.post('/items', authenticateCustomer, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        let cart = await Cart.findOne({ customer: req.user.userId });
        
        if (!cart) {
            cart = new Cart({ customer: req.user.userId, items: [] });
        }

        // Check if product already exists in cart
        const existingItem = cart.items.find(item => 
            item.product?.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // Use Category model directly
            const product = await Category.findById(productId);
            
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            cart.items.push({
                product: productId,
                quantity,
                price: product.price || 0,
                productName: product.name,
                productImage: product.image
            });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Rest of the routes stay the same
// Update cart item quantity
router.put('/items/:itemId', authenticateCustomer, async (req, res) => {
    try {
        const { quantity } = req.body;
        
        const cart = await Cart.findOne({ customer: req.user.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItem = cart.items.id(req.params.itemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cartItem.quantity = quantity;
        if (quantity <= 0) {
            cart.items.pull(req.params.itemId);
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Remove item from cart
router.delete('/items/:itemId', authenticateCustomer, async (req, res) => {
    try {
        const cart = await Cart.findOne({ customer: req.user.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items.pull(req.params.itemId);
        await cart.save();
        
        res.json(cart);
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Clear cart
router.delete('/', authenticateCustomer, async (req, res) => {
    try {
        const cart = await Cart.findOne({ customer: req.user.userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;