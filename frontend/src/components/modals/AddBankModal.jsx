import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { Building2, ShieldCheck } from 'lucide-react';

export const AddBankModal = () => {
  const { isAddBankOpen, setIsAddBankOpen, handleAddBankAccount, user } = useApp();

  const [formData, setFormData] = useState({
    holderName: user?.name || '',
    bankName: 'HDFC Bank',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const bankOptions = [
    "HDFC Bank",
    "State Bank of India (SBI)",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "IndusInd Bank"
  ];

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.holderName.trim()) errs.holderName = "Account holder name is required";
    if (!formData.bankName) errs.bankName = "Select a bank name";
    if (!formData.accountNumber || formData.accountNumber.length < 9) {
      errs.accountNumber = "Enter a valid account number (min 9 digits)";
    }
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      errs.confirmAccountNumber = "Account numbers do not match";
    }
    if (!formData.ifscCode || formData.ifscCode.length < 5) {
      errs.ifscCode = "Invalid IFSC code format (e.g. HDFC0001234)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const success = await handleAddBankAccount(formData);
    setLoading(false);
    if (success) {
      setIsAddBankOpen(false);
      setFormData({
        holderName: user?.name || '',
        bankName: 'HDFC Bank',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: ''
      });
    }
  };

  return (
    <Modal
      isOpen={isAddBankOpen}
      onClose={() => setIsAddBankOpen(false)}
      title="Link Bank Account"
      subtitle="Manage your withdrawal account securely."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account Holder Name */}
        <div>
          <label className="block text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1.5">
            Account Holder Name
          </label>
          <input
            type="text"
            value={formData.holderName}
            onChange={(e) => handleChange('holderName', e.target.value)}
            placeholder="Rajan Kumar"
            className={`w-full px-4 py-2.5 bg-[#061F15] border rounded-xl text-sm font-medium text-[#F8FAFC] focus:outline-none transition-colors ${
              errors.holderName ? 'border-rose-500/80' : 'border-emerald-500/16 focus:border-emerald-500'
            }`}
            required
          />
          {errors.holderName && <p className="text-xs text-rose-300 mt-1">{errors.holderName}</p>}
        </div>

        {/* Bank Name */}
        <div>
          <label className="block text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1.5">
            Bank Name
          </label>
          <select
            value={formData.bankName}
            onChange={(e) => handleChange('bankName', e.target.value)}
            className="w-full px-4 py-2.5 bg-[#061F15] border border-emerald-500/16 rounded-xl text-sm font-medium text-[#F8FAFC] focus:outline-none focus:border-emerald-500 transition-colors"
          >
            {bankOptions.map(b => (
              <option key={b} value={b} className="bg-[#061F15] text-[#F8FAFC]">{b}</option>
            ))}
          </select>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1.5">
            Account Number
          </label>
          <input
            type="password"
            value={formData.accountNumber}
            onChange={(e) => handleChange('accountNumber', e.target.value)}
            placeholder="Enter account number"
            className={`w-full px-4 py-2.5 bg-[#061F15] border rounded-xl text-sm font-mono text-[#F8FAFC] focus:outline-none transition-colors ${
              errors.accountNumber ? 'border-rose-500/80' : 'border-emerald-500/16 focus:border-emerald-500'
            }`}
            required
          />
          {errors.accountNumber && <p className="text-xs text-rose-300 mt-1">{errors.accountNumber}</p>}
        </div>

        {/* Confirm Account Number */}
        <div>
          <label className="block text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1.5">
            Confirm Account Number
          </label>
          <input
            type="text"
            value={formData.confirmAccountNumber}
            onChange={(e) => handleChange('confirmAccountNumber', e.target.value)}
            placeholder="Re-enter account number"
            className={`w-full px-4 py-2.5 bg-[#061F15] border rounded-xl text-sm font-mono text-[#F8FAFC] focus:outline-none transition-colors ${
              errors.confirmAccountNumber ? 'border-rose-500/80' : 'border-emerald-500/16 focus:border-emerald-500'
            }`}
            required
          />
          {errors.confirmAccountNumber && <p className="text-xs text-rose-300 mt-1">{errors.confirmAccountNumber}</p>}
        </div>

        {/* IFSC Code */}
        <div>
          <label className="block text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1.5">
            IFSC Code
          </label>
          <input
            type="text"
            value={formData.ifscCode}
            onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
            placeholder="e.g. HDFC0001234"
            className={`w-full px-4 py-2.5 bg-[#061F15] border rounded-xl text-sm font-mono uppercase text-[#F8FAFC] focus:outline-none transition-colors ${
              errors.ifscCode ? 'border-rose-500/80' : 'border-emerald-500/16 focus:border-emerald-500'
            }`}
            required
          />
          {errors.ifscCode && <p className="text-xs text-rose-300 mt-1">{errors.ifscCode}</p>}
        </div>

        {/* Security Note */}
        <div className="p-3 rounded-xl bg-[#061F15] border border-emerald-500/20 text-xs text-[#A7B8AE] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#F4D06F] shrink-0" />
          <span>Your bank details are securely protected.</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setIsAddBankOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            icon={Building2}
          >
            Add Bank Account
          </Button>
        </div>
      </form>
    </Modal>
  );
};
