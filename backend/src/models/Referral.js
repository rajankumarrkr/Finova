import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    eligibleAmount: {
      type: Number,
      required: true
    },
    rewardRate: {
      type: Number,
      default: 0.10 // 10% default
    },
    rewardAmount: {
      type: Number,
      required: true
    },
    sourceTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    },
    status: {
      type: String,
      enum: ['pending', 'credited', 'reversed'],
      default: 'credited'
    }
  },
  {
    timestamps: true
  }
);

export const Referral = mongoose.model('Referral', referralSchema);
