const express = require('express');
const router = express.Router();
const { createRoom, getRoom, joinRoom, deleteRoom } = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');

// Room / Group endpoints
router.post('/create', protect, createRoom);
router.get('/', protect, getRoom);
router.post('/join', protect, joinRoom);
router.delete('/:id', protect, deleteRoom);

module.exports = router;