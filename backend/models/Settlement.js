const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify who is paying'],
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify who is receiving the payment'],
  },
  amount: {
    type: Number,
    required: [true, 'Please specify the settlement amount'],
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Settlement must belong to a room or group'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'JazzCash', 'EasyPaisa', 'Other'],
    default: 'Cash',
  },
  note: {
    type: String,
    trim: true, // Misal ke tor par: "October electricity share"
  },
},
  {
    timestamps: true,
  });

module.exports = mongoose.model('Settlement', settlementSchema);