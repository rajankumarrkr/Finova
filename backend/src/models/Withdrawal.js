import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
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
      min: 1
    },
    bankAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BankAccount',
      required: true
    },
    bankDetails: {
      accountHolderName: { type: String, trim: true },
      bankName: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      ifsc: { type: String, trim: true }
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'processing', 'completed', 'rejected', 'cancelled'],
      default: 'pending',
      index: true
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    processedAt: Date,
    adminNote: String,
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  },
  {
    timestamps: true
  }
);

export const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
