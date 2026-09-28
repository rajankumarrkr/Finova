import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { Headset, Mail, PhoneCall, ShieldCheck, FileText, ExternalLink } from 'lucide-react';

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
            className="p-4 rounded-2xl glass-panel-interactive border-slate-800 cursor-pointer flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Headset className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Live Support Chat</h5>
              <p className="text-xs text-slate-400">Average response &lt; 2 mins</p>
            </div>
          </div>

          <div
            onClick={() => handleContact('Email Desk')}
            className="p-4 rounded-2xl glass-panel-interactive border-slate-800 cursor-pointer flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Email Ticket</h5>
              <p className="text-xs text-slate-400">support@finova.app</p>
            </div>
          </div>
        </div>

        {/* FAQs list */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Frequently Asked Questions</h5>
          
          <details className="group border-b border-slate-800 pb-2">
            <summary className="text-xs font-semibold text-slate-200 cursor-pointer hover:text-emerald-400 flex justify-between items-center">
              <span>How are daily returns credited?</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Daily returns are automatically calculated and credited directly to your Available Balance every morning at 10:00 AM UTC.
            </p>
          </details>

          <details className="group border-b border-slate-800 pb-2">
            <summary className="text-xs font-semibold text-slate-200 cursor-pointer hover:text-emerald-400 flex justify-between items-center">
              <span>What is the minimum withdrawal limit?</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Minimum withdrawal amount is ₹100. Withdrawals are processed instantly via IMPS to your verified bank account.
            </p>
          </details>

          <details className="group">
            <summary className="text-xs font-semibold text-slate-200 cursor-pointer hover:text-emerald-400 flex justify-between items-center">
              <span>How does the 10% referral program work?</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Share your code (RAJAN50). When referred users activate an investment plan, 10% of their deposit is immediately credited to your withdrawable balance.
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
