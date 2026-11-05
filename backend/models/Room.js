const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: [true, 'Please add a room or group name'],
      trim: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A room must have a group admin'],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    monthlyRent: {
      type: Number,
      required: [true, 'Please specify the monthly rent or total budget'],
    },
    raastId: {
      type: String,
      trim: true,
      default: '',
    },
    easypaisaNumber: {
      type: String,
      trim: true,
      default: '',
    },
    inviteCode: {
      type: String,
      unique: true,
      required: false, // Backend controller isay khud generate karega
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);