import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';
import { ArrowDownLeft, CreditCard, Smartphone, Building2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DepositModal = () => {
  const { isDepositOpen, setIsDepositOpen, handleDepositSubmit } = useApp();
  const [amount, setAmount] = useState('5000');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'success'

  const presets = [1000, 5000, 10000, 25000];

  const handleContinue = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    setTimeout(() => {
      handleDepositSubmit(amount, paymentMethod);
      setLoading(false);
      setStep('form');
    }, 800);
  };

  const handleModalClose = () => {
    setIsDepositOpen(false);
    setStep('form');
  };

  return (
    <Modal
      isOpen={isDepositOpen}
      onClose={handleModalClose}
      title="Deposit Funds"
      subtitle="Add money instantly to your investment wallet"
    >
      <form onSubmit={handleContinue} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Enter Deposit Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold font-mono text-emerald-400">
              ₹
            </span>
            <input
              type="number"
              min="100"
              max="500000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xl font-mono font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              required
            />
          </div>

          {/* Presets */}
          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  amount === preset.toString()
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                +₹{preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Select Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                paymentMethod === 'upi'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Smartphone className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                paymentMethod === 'card'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CreditCard className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                paymentMethod === 'netbanking'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Building2 className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Net Banking</span>
            </button>
          </div>
        </div>

        {/* Mock Payment Disclaimer */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>Simulation Mode: This deposit will add mock funds directly to your wallet without real gateway interaction.</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="ghost"
            fullWidth
            onClick={handleModalClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            icon={ArrowDownLeft}
          >
            Continue
          </Button>
        </div>
      </form>
    </Modal>
  );
};
