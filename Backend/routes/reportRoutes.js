const express = require('express');
const router = express.Router();
const Report = require('../models/reportModel');
const User = require('../models/userModel');

// Submit a report
router.post('/', async (req, res) => {
    try {
        const report = new Report({
            employeeId: req.body.employeeId,
            managerId: req.body.managerId,
            subject: req.body.subject,
            content: req.body.content,
            attachments: req.body.attachments || []
        });

        const newReport = await report.save();
        const populatedReport = await Report.findById(newReport._id)
            .populate('employeeId', 'name email')
            .populate('managerId', 'name email');

        res.status(201).json(populatedReport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get manager info for reporting
router.get('/manager', async (req, res) => {
    try {
        const managers = await User.find({ role: 'admin' })
            .select('name email');
        
        if (!managers.length) {
            return res.status(404).json({ message: 'No managers found' });
        }

        res.json(managers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get reports for an employee
router.get('/employee/:employeeId', async (req, res) => {
    try {
        const reports = await Report.find({ employeeId: req.params.employeeId })
            .populate('managerId', 'name email')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get report by ID
router.get('/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('employeeId', 'name email')
            .populate('managerId', 'name email');
            
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;