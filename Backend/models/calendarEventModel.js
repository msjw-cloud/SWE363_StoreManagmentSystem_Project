// models/calendarEventModel.js
const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['training', 'holiday', 'meeting', 'extra-shift', 'notification', 'performance']
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);