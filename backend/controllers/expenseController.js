const Expense = require('../models/Expense');
const Room = require('../models/Room');

const createExpense = async (req, res) => {
    try {
        const { title, amount, paidBy, roomId, splitBetween, category, expenseType, itemPhotoUrl, approvalStatus, date } = req.body;

        if (!title || !amount || !roomId || !splitBetween || splitBetween.length === 0) {
            return res.status(400).json({ success: false, message: 'Please fill all required fields' });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const expense = await Expense.create({
            title,
            amount,
            paidBy: paidBy || req.user._id, // Agar body mein na ho toh logged-in user aajayega
            roomId,
            splitBetween,
            category: category || 'Other',
            expenseType: expenseType || 'VARIABLE',
            itemPhotoUrl: itemPhotoUrl || null,
            approvalStatus: approvalStatus || 'APPROVED',
            date: date || Date.now()
        });

        res.status(201).json({
            success: true,
            message: 'Expense created successfully',
            expense
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getRoomExpenses = async (req, res) => {
    try {
        const { roomId } = req.params;

        const expenses = await Expense.find({ roomId })
            .populate('paidBy', 'name email phone')
            .populate('splitBetween', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: expenses.length,
            expenses
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        res.json({ success: true, message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createExpense,
    getRoomExpenses,
    deleteExpense
};