const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 });
        
        // Count tasks by status
        const taskCounts = {
            pending: await Task.countDocuments({ status: 'pending' }),
            inProgress: await Task.countDocuments({ status: 'in-progress' }),
            completed: await Task.countDocuments({ status: 'completed' })
        };

        res.json({
            tasks,
            counts: taskCounts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get tasks by category
router.get('/category/:category', async (req, res) => {
    try {
        const tasks = await Task.find({ category: req.params.category })
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new task
router.post('/', async (req, res) => {
    try {
        const task = new Task(req.body);
        const newTask = await task.save();
        const populatedTask = await Task.findById(newTask._id)
            .populate('assignedTo', 'name');
        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update task status
router.put('/:id/status', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = req.body.status;
        const updatedTask = await task.save();
        const populatedTask = await Task.findById(updatedTask._id)
            .populate('assignedTo', 'name');
        
        res.json(populatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update delivery status
router.put('/:id/delivery-status', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.deliveryStatus = req.body.deliveryStatus;
        const updatedTask = await task.save();
        const populatedTask = await Task.findById(updatedTask._id)
            .populate('assignedTo', 'name');
        
        res.json(populatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update task
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('assignedTo', 'name');
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;