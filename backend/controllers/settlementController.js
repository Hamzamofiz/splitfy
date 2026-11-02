const Room = require('../models/Room');
const Settlement = require('../models/Settlement');

const createSettlement = async (req, res) => {
    try {
        const { roomId, payee, amount, paymentMethod, status, note } = req.body;

        if (!roomId || !payee || !amount) {
            return res.status(400).json({ success: false, message: 'Please fill all required fields' });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const settlement = await Settlement.create({
            roomId,
            payer: req.user._id, 
            payee,
            amount,
            paymentMethod: paymentMethod || 'Cash',
            status: status || 'Completed',
            note: note || ''
        });

        res.status(201).json({
            success: true,
            message: 'Settlement recorded successfully',
            settlement
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getRoomSettlements = async (req, res) => {
    try {
        const { roomId } = req.params;

        const settlements = await Settlement.find({ roomId })
            .populate('payer', 'name email phone')
            .populate('payee', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: settlements.length,
            settlements
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateSettlement = async (req, res) => {
    try {
        const { amount, paymentMethod, status, note } = req.body;

        let settlement = await Settlement.findById(req.params.id);
        if (!settlement) {
            return res.status(404).json({ success: false, message: 'Settlement not found' });
        }

        settlement = await Settlement.findByIdAndUpdate(
            req.params.id,
            { amount, paymentMethod, status, note },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Settlement updated successfully',
            settlement
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const deleteSettlement = async (req, res) => {
    try {
        const settlement = await Settlement.findByIdAndDelete(req.params.id);

        if (!settlement) {
            return res.status(404).json({ success: false, message: 'Settlement not found' });
        }

        res.json({
            success: true,
            message: 'Settlement deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createSettlement,
    getRoomSettlements,
    updateSettlement,
    deleteSettlement
};