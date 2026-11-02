const mongoose = require('mongoose');

const leaseAgreementSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lease must be assigned to a tenant'],
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Lease must belong to a specific room or property'],
    },
    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lease must be issued by a landlord'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please specify the lease start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please specify the lease end date'],
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Please specify the security deposit amount'],
    },
    monthlyRent: {
      type: Number,
      required: [true, 'Please specify the agreed monthly rent'],
    },
    agreementPdfUrl: {
      type: String,
      default: null, // Signed lease agreement document URL
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'TERMINATED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LeaseAgreement', leaseAgreementSchema);