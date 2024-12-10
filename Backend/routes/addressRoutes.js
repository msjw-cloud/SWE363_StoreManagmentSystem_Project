const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Middleware to verify customer token
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

// Get all addresses for a customer
router.get('/', authenticateCustomer, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            addresses: user.addresses,
            defaultAddress: user.defaultAddress
        });
    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Add new address
router.post('/', authenticateCustomer, async (req, res) => {
    try {
        const { street, city, state, country, postalCode } = req.body;
        
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newAddress = {
            street,
            city,
            state,
            country,
            postalCode
        };

        user.addresses.push(newAddress);
        
        // If this is the first address, make it the default
        if (user.addresses.length === 1) {
            user.defaultAddress = user.addresses[0]._id;
        }

        await user.save();
        res.status(201).json({
            message: 'Address added successfully',
            address: newAddress
        });
    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update address
router.put('/:addressId', authenticateCustomer, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const address = user.addresses.id(req.params.addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        const { street, city, state, country, postalCode } = req.body;
        
        if (street) address.street = street;
        if (city) address.city = city;
        if (state) address.state = state;
        if (country) address.country = country;
        if (postalCode) address.postalCode = postalCode;

        await user.save();
        res.json({
            message: 'Address updated successfully',
            address
        });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Set default address
router.put('/:addressId/default', authenticateCustomer, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const address = user.addresses.id(req.params.addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        user.defaultAddress = address._id;
        await user.save();

        res.json({
            message: 'Default address updated successfully',
            defaultAddress: address
        });
    } catch (error) {
        console.error('Set default address error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete address
router.delete('/:addressId', authenticateCustomer, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const address = user.addresses.id(req.params.addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // If deleting default address, set new default if other addresses exist
        if (user.defaultAddress?.equals(address._id) && user.addresses.length > 1) {
            const newDefaultAddress = user.addresses.find(addr => !addr._id.equals(address._id));
            user.defaultAddress = newDefaultAddress._id;
        } else if (user.addresses.length === 1) {
            user.defaultAddress = null;
        }

        address.remove();
        await user.save();

        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;