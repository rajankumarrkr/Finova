import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InvestmentPlan',
      required: true
    },
    planName: String,
    badge: String,
    color: String,
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    dailyEarning: {
      type: Number,
      required: true,
      min: 0
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1
    },
    completedDays: {
      type: Number,
      default: 0
    },
    totalEarned: {
      type: Number,
      default: 0
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    nextEarningAt: {
      type: Date,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'active',
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const Investment = mongoose.model('Investment', investmentSchema);
