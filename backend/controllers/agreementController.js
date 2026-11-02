const LeaseAgreement = require('../models/Agreement'); 
const Room = require('../models/Room');
const User = require('../models/User');


const createAgreement = async (req, res) => {
    try {
        const { tenantId, roomId, landlordId, startDate, endDate, securityDeposit, monthlyRent, agreementPdfUrl, status } = req.body;

        if (!tenantId || !roomId || !landlordId || !startDate || !endDate || !securityDeposit || !monthlyRent) {
            return res.status(400).json({ success: false, message: 'Please fill all required lease fields' });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const agreement = await LeaseAgreement.create({
            tenantId,
            roomId,
            landlordId: landlordId || req.user._id,
            startDate,
            endDate,
            securityDeposit,
            monthlyRent,
            agreementPdfUrl: agreementPdfUrl || null,
            status: status || 'ACTIVE'
        });

        res.status(201).json({
            success: true,
            message: 'Lease agreement created successfully',
            agreement
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getRoomAgreements = async (req, res) => {
    try {
        const { roomId } = req.params;

        const agreements = await LeaseAgreement.find({ roomId })
            .populate('tenantId', 'name email phone')
            .populate('landlordId', 'name email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: agreements.length,
            agreements
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getAgreementById = async (req, res) => {
    try {
        const agreement = await LeaseAgreement.findById(req.params.id)
            .populate('tenantId', 'name email phone')
            .populate('landlordId', 'name email phone');

        if (!agreement) {
            return res.status(404).json({ success: false, message: 'Lease agreement not found' });
        }

        res.json({
            success: true,
            agreement
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateAgreement = async (req, res) => {
    try {
        const { startDate, endDate, securityDeposit, monthlyRent, agreementPdfUrl, status } = req.body;

        let agreement = await LeaseAgreement.findById(req.params.id);
        if (!agreement) {
            return res.status(404).json({ success: false, message: 'Lease agreement not found' });
        }

        agreement = await LeaseAgreement.findByIdAndUpdate(
            req.params.id,
            { startDate, endDate, securityDeposit, monthlyRent, agreementPdfUrl, status },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Lease agreement updated successfully',
            agreement
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const deleteAgreement = async (req, res) => {
    try {
        const agreement = await LeaseAgreement.findByIdAndDelete(req.params.id);

        if (!agreement) {
            return res.status(404).json({ success: false, message: 'Lease agreement not found' });
        }

        res.json({
            success: true,
            message: 'Lease agreement deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createAgreement,
    getRoomAgreements,
    getAgreementById,
    updateAgreement,
    deleteAgreement
};