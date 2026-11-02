const express = require('express');
const router = express.Router();
const {
    createMaintenance,
    getRoomMaintenance,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createMaintenance);
router.get('/room/:roomId', protect, getRoomMaintenance);
router.get('/:id', protect, getMaintenanceById);
router.patch('/:id', protect, updateMaintenance);
router.delete('/:id', protect, deleteMaintenance);

module.exports = router;