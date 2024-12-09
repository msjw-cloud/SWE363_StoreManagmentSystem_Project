// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const User = require('../models/userModel');

// Get all received messages for a user
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find({ recipient: req.body.userId })
            .populate('sender', 'name')
            .populate('recipient', 'name')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get sent messages
router.get('/sent', async (req, res) => {
    try {
        const messages = await Message.find({ sender: req.body.userId })
            .populate('sender', 'name')
            .populate('recipient', 'name')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Send a new message
router.post('/', async (req, res) => {
    try {
        const message = new Message({
            sender: req.body.userId,
            recipient: req.body.recipientId,
            subject: req.body.subject,
            content: req.body.content,
            attachments: req.body.attachments || []
        });

        const newMessage = await message.save();
        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'name')
            .populate('recipient', 'name');

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Mark message as read
router.put('/:id/read', async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.isRead = true;
        await message.save();

        res.json({ message: 'Message marked as read' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a message
router.delete('/:id', async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await message.deleteOne();
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all contacts (employees)
router.get('/contacts', async (req, res) => {
    try {
        const contacts = await User.find(
            { _id: { $ne: req.body.userId } },
            'name email'
        ).sort({ name: 1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;