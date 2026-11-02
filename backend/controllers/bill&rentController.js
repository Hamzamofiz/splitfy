const Room = require('../models/Room');
const Bill = require('../models/BillRent');


const createBill = async (req, res) => {
    try {
        const { title, totalAmount, dueDate, billType, roomId, assignedTo, utilityPdfUrl, meterPhotoUrl } = req.body;

        if (!title || !totalAmount || !dueDate || !billType || !roomId || !assignedTo) {
            return res.status(400).json({ success: false, message: 'Please fill all required fields' });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const bill = await Bill.create({
            title,
            totalAmount,
            dueDate,
            billType,
            roomId,
            assignedTo,
            utilityPdfUrl: utilityPdfUrl || null,
            meterPhotoUrl: meterPhotoUrl || null
        });

        res.status(201).json({
            success: true,
            message: 'Bill created successfully',
            bill
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getRoomBills = async (req, res) => {
    try {
        const { roomId } = req.params;

        const bills = await Bill.find({ roomId })
            .populate('assignedTo.user', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: bills.length,
            bills
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const markBillPaid = async (req, res) => {
    try {
        const { billId } = req.params;
        const userId = req.user._id;

        const bill = await Bill.findById(billId);
        if (!bill) {
            return res.status(404).json({ success: false, message: 'Bill not found' });
        }

    
        const assignment = bill.assignedTo.find(item => item.user.toString() === userId.toString());
        if (!assignment) {
            return res.status(403).json({ success: false, message: 'You are not assigned to this bill' });
        }

        assignment.isPaid = true;
        assignment.paidAt = Date.now();

        
        const allPaid = bill.assignedTo.every(item => item.isPaid);
        const somePaid = bill.assignedTo.some(item => item.isPaid);

        if (allPaid) {
            bill.status = 'Paid';
        } else if (somePaid) {
            bill.status = 'Partially Paid';
        }

        await bill.save();

        res.json({
            success: true,
            message: 'Payment status updated successfully',
            bill
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);

        if (!bill) {
            return res.status(404).json({ success: false, message: 'Bill not found' });
        }

        res.json({ success: true, message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: `${error.message}` });
    }
};

module.exports = {
    createBill,
    getRoomBills,
    markBillPaid,
    deleteBill
};