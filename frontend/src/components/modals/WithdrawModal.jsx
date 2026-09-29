import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';
import { ArrowDownLeft, Building2, AlertCircle, ShieldCheck, Plus } from 'lucide-react';

export const WithdrawModal = () => {
  const {
    isWithdrawOpen,
    setIsWithdrawOpen,
    user,
    bankAccounts,
    handleWithdrawSubmit,
    setIsAddBankOpen
  } = useApp();

  const [amount, setAmount] = useState('');
  const [selectedBankId, setSelectedBankId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableBalance = user?.balances?.availableBalance || 0;

  useEffect(() => {
    if (bankAccounts && bankAccounts.length > 0) {
      const primary = bankAccounts.find(b => b.isDefault || b.isPrimary);
      setSelectedBankId(primary ? (primary.id || primary._id) : (bankAccounts[0].id || bankAccounts[0]._id));
    }
  }, [bankAccounts]);

  const handleAmountChange = (e) => {
    const val = e.target.value;
    setAmount(val);
    const num = parseFloat(val);

    if (num > availableBalance) {
      setError(`Amount exceeds available balance of ${formatCurrency(availableBalance)}`);
    } else {
      setError('');
    }
  };

  const handleSetMax = () => {
    setAmount(availableBalance.toString());
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      setError('Please enter a valid withdrawal amount');
      return;
    }
    if (num > availableBalance) {
      setError('Amount exceeds available balance');
      return;
    }
    if (bankAccounts.length === 0) {
      setError('Please link a bank account before withdrawing');
      return;
    }

    const targetBankId = selectedBankId || (bankAccounts[0]?.id || bankAccounts[0]?._id);
    if (!targetBankId) {
      setError('Please select a destination bank account');
      return;
    }

    setLoading(true);
    const success = await handleWithdrawSubmit(num, targetBankId);
    setLoading(false);

    if (success) {
      setAmount('');
    }
  };

  return (
    <Modal
      isOpen={isWithdrawOpen}
      onClose={() => setIsWithdrawOpen(false)}
      title="Request Withdrawal"
      subtitle="Transfer funds from available balance to your bank account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Available Balance Header */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase">Available Balance</span>
            <div className="text-2xl font-mono font-bold text-white mt-0.5">
              {formatCurrency(availableBalance)}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSetMax}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold hover:bg-emerald-500/20 transition-colors"
          >
            WITHDRAW MAX
          </button>
        </div>

        {/* Enter Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Enter Withdrawal Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold font-mono text-emerald-400">
              ₹
            </span>
            <input
              type="number"
              min="100"
              max={availableBalance}
              value={amount}
              onChange={handleAmountChange}
              placeholder="1000.00"
              className={`w-full pl-10 pr-4 py-3 bg-slate-950/80 border rounded-2xl text-xl font-mono font-bold text-white focus:outline-none transition-colors ${
                error ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-700/80 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
              }`}
              required
            />
          </div>
          {error && (
            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}
        </div>

        {/* Bank Account Selector */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Destination Bank Account
            </label>
            <button
              type="button"
              onClick={() => {
                setIsWithdrawOpen(false);
                setIsAddBankOpen(true);
              }}
              className="text-xs font-medium text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Bank
            </button>
          </div>

          {bankAccounts.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
              <span>No bank account linked yet.</span>
              <Button
                variant="emerald"
                size="sm"
                onClick={() => {
                  setIsWithdrawOpen(false);
                  setIsAddBankOpen(true);
                }}
              >
                Add Account Now
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {bankAccounts.map((bank) => {
                const bId = bank.id || bank._id;
                const isSelected = selectedBankId === bId;
                return (
                  <div
                    key={bId}
                    onClick={() => setSelectedBankId(bId)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/60 shadow-md shadow-emerald-500/5'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-white">{bank.bankName}</h5>
                        <p className="text-xs font-mono text-slate-400">{bank.accountNumber || `XXXX XXXX ${bank.accountNumberLast4}`} ({bank.holderName || bank.accountHolderName})</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {bank.status || 'Verified'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Security Info */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Withdrawals are processed via instant IMPS payouts within 24 hours.</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setIsWithdrawOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={!!error || bankAccounts.length === 0}
            icon={ArrowDownLeft}
          >
            Request Withdrawal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
