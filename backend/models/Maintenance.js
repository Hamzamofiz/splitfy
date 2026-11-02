const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Maintenance issue must belong to a room'],
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify who reported the issue'],
    },
    issueType: {
      type: String,
      enum: ['AC', 'Plumbing', 'Electricity', 'Carpentry', 'Other'],
      required: [true, 'Please specify the issue type'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a short description of the issue'],
      trim: true,
    },
    attachmentUrl: {
      type: String,
      default: null, // Photo or Video proof URL
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED'],
      default: 'PENDING',
    },
    repairCost: {
      type: Number,
      default: 0, // Agar repair par koi kharcha aaye toh split karne ke liye
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);