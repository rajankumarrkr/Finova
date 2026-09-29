import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { Headset, Mail } from 'lucide-react';

export const SupportModal = () => {
  const { isSupportOpen, setIsSupportOpen, showToast } = useApp();

  const handleContact = (method) => {
    showToast(`Connecting to ${method}... Support team will reply shortly.`, 'info');
    setIsSupportOpen(false);
  };

  return (
    <Modal
      isOpen={isSupportOpen}
      onClose={() => setIsSupportOpen(false)}
      title="Help & Support Desk"
      subtitle="24/7 dedicated investor support team"
    >
      <div className="space-y-4">
        {/* Support Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => handleContact('Live Chat')}
            className="p-4 rounded-2xl bg-[#061F15] border border-emerald-500/16 hover:border-emerald-500/35 cursor-pointer flex items-center gap-3 transition-all"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-[#34D399] border border-emerald-500/30">
              <Headset className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-[#F8FAFC]">Live Support Chat</h5>
              <p className="text-xs text-[#71857A]">Response time &lt; 2 mins</p>
            </div>
          </div>

          <div
            onClick={() => handleContact('Email Desk')}
            className="p-4 rounded-2xl bg-[#061F15] border border-emerald-500/16 hover:border-emerald-500/35 cursor-pointer flex items-center gap-3 transition-all"
          >
            <div className="p-2.5 rounded-xl bg-amber-400/15 text-[#F4D06F] border border-amber-400/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-[#F8FAFC]">Email Ticket</h5>
              <p className="text-xs text-[#71857A]">support@finova.app</p>
            </div>
          </div>
        </div>

        {/* FAQs list */}
        <div className="p-4 rounded-2xl bg-[#061F15] border border-emerald-500/16 space-y-3">
          <h5 className="text-xs font-semibold text-[#A7B8AE] uppercase tracking-wider mb-2">Frequently Asked Questions</h5>
          
          <details className="group border-b border-emerald-500/16 pb-2">
            <summary className="text-xs font-bold text-[#F8FAFC] cursor-pointer hover:text-[#F4D06F] flex justify-between items-center">
              <span>How are daily returns credited?</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-[#A7B8AE] mt-2 leading-relaxed font-sans">
              Daily returns are automatically calculated and credited directly to your Available Balance every morning.
            </p>
          </details>

          <details className="group border-b border-emerald-500/16 pb-2">
            <summary className="text-xs font-bold text-[#F8FAFC] cursor-pointer hover:text-[#F4D06F] flex justify-between items-center">
              <span>What is the minimum withdrawal limit?</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-[#A7B8AE] mt-2 leading-relaxed font-sans">
              Minimum withdrawal amount is ₹100. Withdrawals are processed instantly via IMPS to your verified bank account.
            </p>
          </details>

          <details className="group">
            <summary className="text-xs font-bold text-[#F8FAFC] cursor-pointer hover:text-[#F4D06F] flex justify-between items-center">
              <span>How does the 10% referral program work?</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-[#A7B8AE] mt-2 leading-relaxed font-sans">
              Share your referral code. When referred team members activate an investment plan, 10% of their deposit is immediately credited to your balance.
            </p>
          </details>
        </div>

        {/* Action Button */}
        <Button variant="secondary" fullWidth onClick={() => setIsSupportOpen(false)}>
          Close Help Desk
        </Button>
      </div>
    </Modal>
  );
};
