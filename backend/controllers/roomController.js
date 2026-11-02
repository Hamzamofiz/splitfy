const Room = require('../models/Room');
const crypto = require('crypto');



const createRoom = async(req, res) => {
    try {
        const { roomName, monthlyRent } = req.body;

        if (!roomName || !monthlyRent) {
            return res.status(400).json({ success: false, message: 'Please provide room name and monthly rent ' });
        }

        const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        const room = await Room.create({
            roomName,
            monthlyRent,
            landlord: req.user._id,
            members: [req.user._id],
            inviteCode
        })
        res.status(201).json({ success: true, data: room });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getRoom = async(req, res) => {
    try {
        const room = await Room.findOne({ members: req.user._id })
            .populate('landlord', ' name email phone')
            .populate('members', ' name email phone role');

        if (!room) {
            return res.status(404).json({ succes: false, message: 'you are not assined to any room yet' })
        }

        res.json({ success: true, room });
    } catch (error) {
        res.status(500).json({ success: false, message: `${error.message}` })
    }
};


const joinRoom = async(req, res) => {
    try {
        const { inviteCode } = req.body;

        if (!inviteCode) {
            return res.status(400).json({ success: false, message: 'Please provide invite code ' })
        }

        const room = await Room.findOne({ inviteCode: inviteCode.trim().toUpperCase() })
        if (!room) {
            return res.status(404).json({ success: false, message: 'Invalid invitecode' })
        }

        if (room.members.includes(req.user._id)) {
            return res.status(400).json({ success: false, message: 'You are already in this room' })
        }

        room.members.push(req.user.id);
        await room.save();

        res.json({
            success: true,
            message: 'Joined room successfully',
            room
        })
    } catch (error) {
        res.status(500).json({ success: false, message: `${error.message}` })
    }
};


const deleteRoom =async (req, res) => {
    try{
        const room = await Room.findByIdAndDelete(req.params.id);

        if(!room) {
            return res.status(404).json({success:false, message: 'room not found'});
        }

        res.json({success:true, message:'room delete successfully'})
    } catch(error){
        res.status(500).json({success:false, message:`${error.message}`})
    }
}

module.exports={
 createRoom,
 getRoom,
 joinRoom,
 deleteRoom

}