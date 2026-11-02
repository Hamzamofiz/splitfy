const express = require('express');
const router = express.Router();
const {
    createAgreement,
    getRoomAgreements,
    getAgreementById,
    updateAgreement,
    deleteAgreement
} = require('../controllers/agreementController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createAgreement);
router.get('/room/:roomId', protect, getRoomAgreements);
router.get('/:id', protect, getAgreementById);
router.patch('/:id', protect, updateAgreement);
router.delete('/:id', protect, deleteAgreement);

module.exports = router;