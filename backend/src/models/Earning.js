import mongoose from 'mongoose';

const earningSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    earningDate: {
      type: String, // 'YYYY-MM-DD' formatted for clean daily uniqueness
      required: true
    },
    type: {
      type: String,
      enum: ['daily', 'referral', 'adjustment'],
      default: 'daily'
    },
    status: {
      type: String,
      enum: ['pending', 'credited', 'reversed'],
      default: 'credited'
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  },
  {
    timestamps: true
  }
);

// Idempotency constraint: 1 earning record per user per investment per day
earningSchema.index({ user: 1, investment: 1, earningDate: 1 }, { unique: true });

export const Earning = mongoose.model('Earning', earningSchema);
