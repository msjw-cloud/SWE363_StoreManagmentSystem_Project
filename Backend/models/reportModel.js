const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    attachments: [{
        name: String,
        url: String
    }],
    status: {
        type: String,
        enum: ['pending', 'reviewed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);