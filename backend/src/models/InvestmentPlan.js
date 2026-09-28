import mongoose from 'mongoose';

const investmentPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    badge: {
      type: String,
      required: true
    },
    investmentAmount: {
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
    scheduledEarnings: {
      type: Number,
      required: true
    },
    roi: {
      type: String,
      default: '99%'
    },
    popular: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'emerald'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true
    },
    features: [String],
    description: String,
    terms: String
  },
  {
    timestamps: true
  }
);

export const InvestmentPlan = mongoose.model('InvestmentPlan', investmentPlanSchema);
