const express = require('express');
const router = express.Router();
const {
    createSettlement,
    getRoomSettlements,
    updateSettlement,
    deleteSettlement
} = require('../controllers/settlementController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSettlement);
router.get('/room/:roomId', protect, getRoomSettlements);
router.patch('/:id', protect, updateSettlement);
router.delete('/:id', protect, deleteSettlement);

module.exports = router;