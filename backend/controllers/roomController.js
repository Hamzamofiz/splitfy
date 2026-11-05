const Room = require('../models/Room');
const User = require('../models/User');
const crypto = require('crypto');

// Create Room (Group Admin)
const createRoom = async (req, res) => {
    try {
        const { roomName, monthlyRent } = req.body;

        if (!roomName || !monthlyRent) {
            return res.status(400).json({ success: false, message: 'Please provide room name and monthly rent' });
        }

        const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        const room = await Room.create({
            roomName,
            monthlyRent,
            admin: req.user._id, // Landlord ki jagah Admin
            members: [req.user._id],
            inviteCode,
        });

        // User profile mein bhi roomId save kar dein
        await User.findByIdAndUpdate(req.user._id, { roomId: room._id });

        res.status(201).json({ success: true, data: room });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get User's Room & Members
const getRoom = async (req, res) => {
    try {
        const room = await Room.findOne({ members: req.user._id })
            .populate('admin', 'name email phone role')
            .populate('members', 'name email phone role');

        if (!room) {
            return res.status(404).json({ success: false, message: 'You are not assigned to any room yet' });
        }

        res.json({ success: true, room });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Join Room via Invite Code (Student / Roommate)
const joinRoom = async (req, res) => {
    try {
        const { inviteCode } = req.body;

        if (!inviteCode) {
            return res.status(400).json({ success: false, message: 'Please provide invite code' });
        }

        const room = await Room.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
        if (!room) {
            return res.status(404).json({ success: false, message: 'Invalid invite code' });
        }

        // Check if already in room
        const isMember = room.members.some(memberId => memberId.toString() === req.user._id.toString());
        if (isMember) {
            return res.status(400).json({ success: false, message: 'You are already in this room' });
        }

        room.members.push(req.user._id);
        await room.save();

        // User profile ke andar bhi roomId attach kar dein
        await User.findByIdAndUpdate(req.user._id, { roomId: room._id });

        res.json({
            success: true,
            message: 'Joined room successfully',
            room,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Room (Only Admin)
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        // Room delete hone se pehle saare members ke roomId ko null kar dein
        await User.updateMany({ roomId: room._id }, { $set: { roomId: null } });

        await Room.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createRoom,
    getRoom,
    joinRoom,
    deleteRoom,
};