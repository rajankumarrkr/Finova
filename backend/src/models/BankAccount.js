import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true
    },
    bankName: {
      type: String,
      required: true,
      trim: true
    },
    accountNumber: {
      type: String,
      trim: true
    },
    accountNumberEncrypted: {
      type: String,
      required: true
    },
    accountNumberLast4: {
      type: String,
      required: true,
      length: 4
    },
    ifsc: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    isVerified: {
      type: Boolean,
      default: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const BankAccount = mongoose.model('BankAccount', bankAccountSchema);
