const express = require('express');
const router = express.Router();
const { 
    createExpense,
    getRoomExpenses,
    deleteExpense 
} = require('../controllers/expenseController');


const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createExpense);
router.get('/room/:roomId', protect, getRoomExpenses);
router.delete('/:id', protect, deleteExpense);

module.exports = router;