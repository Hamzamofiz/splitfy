const express = require('express');
const router = express.Router();
const {createRoom, getRoom, joinRoom,  deleteRoom} = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');



router.post('/createroom', protect, createRoom);
router.get('/getroom', protect, getRoom);
router.post('/joinroom', protect, joinRoom);
router.delete('/deleteroom/:id', protect, deleteRoom);


module.exports= router;

