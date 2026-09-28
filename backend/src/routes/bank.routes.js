import express from 'express';
import { getBankAccounts, addBankAccount, deleteBankAccount } from '../controllers/bank.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = express.Router();

const bankAccountSchema = z.object({
  body: z.object({
    accountHolderName: z.string().min(2, 'Holder name is required'),
    bankName: z.string().min(2, 'Bank name is required'),
    accountNumber: z.string().min(9, 'Account number must be at least 9 digits'),
    ifsc: z.string().min(5, 'IFSC code is required')
  })
});

router.use(protect);

router.get('/', getBankAccounts);
router.post('/', validate(bankAccountSchema), addBankAccount);
router.delete('/:id', deleteBankAccount);

export default router;
