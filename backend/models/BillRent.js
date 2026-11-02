const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the expense'],
    trim: true,
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please specify the total bill amount'],
  },
  dueDate: {
    type: Date,
    required: [true, 'Please specify the due date'],
  },
  billType: {
    type: String,
    enum: ['Rent', 'Electricity', 'Water', 'Gas', 'Maintenance', 'Internet', 'other'],
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'A bill must belong to a specific room or group'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Partially Paid', 'Paid'],
    default: 'Pending',
  },

  utilityPdfUrl: {
    type: String,
    default: null, // Official bill PDF attachment
  },
  meterPhotoUrl: {
    type: String,
    default: null, // Sub-meter photo verification
  },
  assignedTo: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      shareAmount: {
        type: Number,
        required: true,
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      paidAt: {
        type: Date,
        default: null,
      },
    },
  ],
},
  {
    timestamps: true,
  });

module.exports = mongoose.model('Bill', billSchema);