import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['deposit', 'investment', 'daily_earning', 'referral_bonus', 'withdrawal', 'refund', 'adjustment'],
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    direction: {
      type: String,
      enum: ['credit', 'debit'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'reversed', 'Processing'],
      default: 'completed',
      index: true
    },
    reference: String,
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

transactionSchema.index({ createdAt: -1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);
