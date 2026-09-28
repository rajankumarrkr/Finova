import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    provider: {
      type: String,
      default: 'razorpay'
    },
    providerOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    providerPaymentId: {
      type: String,
      sparse: true,
      index: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: ['created', 'captured', 'failed'],
      default: 'created',
      index: true
    },
    signatureVerified: {
      type: Boolean,
      default: false
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

export const Payment = mongoose.model('Payment', paymentSchema);
