const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    month: {
        type: String,
        required: true,
        match: /^\d{4}-(0[1-9]|1[0-2])$/,
    },
    absentDays: {
        type: [Number],
        default: [],
    },
}, {
    timestamps: true,
});

attendanceSchema.index({ roomId: 1, userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
