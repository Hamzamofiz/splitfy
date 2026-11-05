const Attendance = require('../models/Attendance');
const Room = require('../models/Room');

const validMonth = month => typeof month === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(month);

const getAttendance = async (req, res) => {
    try {
        const { roomId, month } = req.query;
        if (!roomId || !validMonth(month)) {
            return res.status(400).json({ success: false, message: 'Please provide a room and valid month (YYYY-MM)' });
        }

        const room = await Room.findOne({ _id: roomId, members: req.user._id });
        if (!room) {
            return res.status(403).json({ success: false, message: 'You are not a member of this room' });
        }

        const attendance = await Attendance.findOne({ roomId, userId: req.user._id, month });
        return res.json({ success: true, attendance });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const saveAttendance = async (req, res) => {
    try {
        const { roomId, month, absentDays } = req.body;
        if (!roomId || !validMonth(month) || !Array.isArray(absentDays)) {
            return res.status(400).json({ success: false, message: 'Please provide a room, valid month, and absent days' });
        }

        const dayCount = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
        const daysAreValid = absentDays.every(day => Number.isInteger(day) && day >= 1 && day <= dayCount);
        if (!daysAreValid || new Set(absentDays).size !== absentDays.length) {
            return res.status(400).json({ success: false, message: 'Absent days must be unique valid dates in the selected month' });
        }

        const room = await Room.findOne({ _id: roomId, members: req.user._id });
        if (!room) {
            return res.status(403).json({ success: false, message: 'You are not a member of this room' });
        }

        const attendance = await Attendance.findOneAndUpdate(
            { roomId, userId: req.user._id, month },
            { $set: { absentDays } },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );
        return res.json({ success: true, attendance });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAttendance, saveAttendance };
