const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the expense'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please specify the amount'],
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify who paid for this expense'],
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'An expense must be attached to a room or group'],
    },
    splitBetween: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    category: {
      type: String,
      enum: ['Food', 'Utilities', 'Rent', 'Maintenance', 'Other'],
      default: 'Other'
    },
    expenseType: {
      type: String,
      enum: ['FIXED', 'VARIABLE'],
      default: 'VARIABLE',
    },
    itemPhotoUrl: {
      type: String,
      default: null,
    },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'APPROVED',
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema);