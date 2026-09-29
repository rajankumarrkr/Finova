import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: [100, 'Minimum deposit amount is ₹100'],
      max: [500000, 'Maximum deposit amount is ₹500,000']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    upiId: {
      type: String,
      required: true
    },
    upiUri: {
      type: String,
      required: true
    },
    paymentReference: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    providerOrderId: {
      type: String,
      sparse: true,
      index: true
    },
    providerPaymentId: {
      type: String,
      sparse: true,
      index: true
    },
    utr: {
      type: String,
      sparse: true,
      index: true
    },
    paymentScreenshot: {
      type: String
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFICATION_PENDING', 'SUCCESS', 'FAILED', 'EXPIRED', 'CANCELLED'],
      default: 'PENDING',
      index: true
    },
    qrCode: {
      type: String
    },
    paidAt: {
      type: Date
    },
    verifiedAt: {
      type: Date
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

depositSchema.index({ createdAt: -1 });

export const Deposit = mongoose.model('Deposit', depositSchema);
