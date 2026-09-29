import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { ArrowDownLeft, CreditCard, Smartphone, Building2, ShieldCheck } from 'lucide-react';

export const DepositModal = () => {
  const { isDepositOpen, setIsDepositOpen, handleDepositSubmit } = useApp();
  const [amount, setAmount] = useState('5000');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  const presets = [1000, 5000, 10000, 25000];

  const handleContinue = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    setTimeout(() => {
      handleDepositSubmit(amount, paymentMethod);
      setLoading(false);
    }, 600);
  };

  const handleModalClose = () => {
    setIsDepositOpen(false);
  };

  return (
    <Modal
      isOpen={isDepositOpen}
      onClose={handleModalClose}
      title="Add Funds"
      subtitle="Instant deposit to your investment wallet"
    >
      <form onSubmit={handleContinue} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-1.5">
            Deposit Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold font-mono text-[#F4D06F]">
              ₹
            </span>
            <input
              type="number"
              min="100"
              max="500000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 bg-[#061F15] border border-emerald-500/16 rounded-2xl text-xl font-mono font-bold text-[#F8FAFC] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  amount === preset.toString()
                    ? 'bg-[#123A29] text-[#F4D06F] border border-amber-400/40 shadow-sm'
                    : 'bg-[#061F15] text-[#A7B8AE] border border-emerald-500/16 hover:border-emerald-500/30'
                }`}
              >
                +₹{preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className="block text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                paymentMethod === 'upi'
                  ? 'bg-[#123A29] border-emerald-500 text-[#34D399] font-bold shadow-md'
                  : 'bg-[#061F15] border-emerald-500/16 text-[#71857A] hover:border-emerald-500/30'
              }`}
            >
              <Smartphone className={`w-5 h-5 mb-1 ${paymentMethod === 'upi' ? 'text-[#F4D06F]' : ''}`} />
              <span className="text-xs font-medium">UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                paymentMethod === 'card'
                  ? 'bg-[#123A29] border-emerald-500 text-[#34D399] font-bold shadow-md'
                  : 'bg-[#061F15] border-emerald-500/16 text-[#71857A] hover:border-emerald-500/30'
              }`}
            >
              <CreditCard className={`w-5 h-5 mb-1 ${paymentMethod === 'card' ? 'text-[#F4D06F]' : ''}`} />
              <span className="text-xs font-medium">Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                paymentMethod === 'netbanking'
                  ? 'bg-[#123A29] border-emerald-500 text-[#34D399] font-bold shadow-md'
                  : 'bg-[#061F15] border-emerald-500/16 text-[#71857A] hover:border-emerald-500/30'
              }`}
            >
              <Building2 className={`w-5 h-5 mb-1 ${paymentMethod === 'netbanking' ? 'text-[#F4D06F]' : ''}`} />
              <span className="text-xs font-medium">Net Banking</span>
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="p-3 rounded-xl bg-[#061F15] border border-emerald-500/20 text-xs text-[#A7B8AE] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#F4D06F] shrink-0" />
          <span>Secured 256-bit encrypted payment gateway processing.</span>
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
            Add Funds
          </Button>
        </div>
      </form>
    </Modal>
  );
};
