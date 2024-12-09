// routes/calendarRoutes.js
const express = require('express');
const router = express.Router();
const CalendarEvent = require('../models/calendarEventModel');

// Get all calendar events
router.get('/', async (req, res) => {
    try {
        const events = await CalendarEvent.find()
            .populate('createdBy', 'name')
            .sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new calendar event
router.post('/', async (req, res) => {
    try {
        const event = new CalendarEvent({
            title: req.body.title,
            type: req.body.type,
            date: new Date(req.body.date),
            description: req.body.description,
            createdBy: req.body.userId // This should come from authenticated user
        });

        const newEvent = await event.save();
        const populatedEvent = await CalendarEvent.findById(newEvent._id)
            .populate('createdBy', 'name');
        
        res.status(201).json(populatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a calendar event
router.put('/:id', async (req, res) => {
    try {
        const event = await CalendarEvent.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Update fields if they exist in request body
        if (req.body.title) event.title = req.body.title;
        if (req.body.type) event.type = req.body.type;
        if (req.body.date) event.date = new Date(req.body.date);
        if (req.body.description) event.description = req.body.description;

        const updatedEvent = await event.save();
        const populatedEvent = await CalendarEvent.findById(updatedEvent._id)
            .populate('createdBy', 'name');
        
        res.json(populatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a calendar event
router.delete('/:id', async (req, res) => {
    try {
        const event = await CalendarEvent.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await event.deleteOne();
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get events by month and year
router.get('/:year/:month', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month) - 1; // JavaScript months are 0-based
        
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        const events = await CalendarEvent.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('createdBy', 'name').sort({ date: 1 });

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;