const express = require('express');
const router = express.Router();
const {
    createBill,
    getRoomBills,
    markBillPaid,
    deleteBill
} = require('../controllers/bill&rentController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBill);
router.get('/room/:roomId', protect, getRoomBills);
router.patch('/:billId/pay', protect, markBillPaid);
router.delete('/:id', protect, deleteBill);

module.exports = router;