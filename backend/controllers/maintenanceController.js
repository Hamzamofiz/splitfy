const Maintenance = require('../models/Maintenance');
const Room = require('../models/Room');

const createMaintenance = async (req, res) => {
    try {
        const { roomId, issueType, description, attachmentUrl, status, repairCost } = req.body;

        if (!roomId || !issueType || !description) {
            return res.status(400).json({ success: false, message: 'Please fill all required fields' });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const maintenance = await Maintenance.create({
            roomId,
            reportedBy: req.user._id, 
            issueType,
            description,
            attachmentUrl: attachmentUrl || null,
            status: status || 'PENDING',
            repairCost: repairCost || 0
        });

        res.status(201).json({
            success: true,
            message: 'Maintenance issue reported successfully',
            maintenance
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getRoomMaintenance = async (req, res) => {
    try {
        const { roomId } = req.params;

        const maintenanceIssues = await Maintenance.find({ roomId })
            .populate('reportedBy', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: maintenanceIssues.length,
            maintenanceIssues
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getMaintenanceById = async (req, res) => {
    try {
        const maintenance = await Maintenance.findById(req.params.id)
            .populate('reportedBy', 'name email phone');

        if (!maintenance) {
            return res.status(404).json({ success: false, message: 'Maintenance issue not found' });
        }

        res.json({
            success: true,
            maintenance
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateMaintenance = async (req, res) => {
    try {
        const { issueType, description, attachmentUrl, status, repairCost } = req.body;

        let maintenance = await Maintenance.findById(req.params.id);
        if (!maintenance) {
            return res.status(404).json({ success: false, message: 'Maintenance issue not found' });
        }

        const updates = {};
        if (issueType !== undefined) updates.issueType = issueType;
        if (description !== undefined) updates.description = description;
        if (attachmentUrl !== undefined) updates.attachmentUrl = attachmentUrl;
        if (status !== undefined) updates.status = status;
        if (repairCost !== undefined) updates.repairCost = repairCost;

        maintenance = await Maintenance.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Maintenance issue updated successfully',
            maintenance
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// @access  Private
const deleteMaintenance = async (req, res) => {
    try {
        const maintenance = await Maintenance.findByIdAndDelete(req.params.id);

        if (!maintenance) {
            return res.status(404).json({ success: false, message: 'Maintenance issue not found' });
        }

        res.json({
            success: true,
            message: 'Maintenance issue deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createMaintenance,
    getRoomMaintenance,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance
};