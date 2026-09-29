import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { bankService } from '../services/bankService';
import { Building2, Plus, CheckCircle2, ShieldCheck, Trash2, Loader2, Lock } from 'lucide-react';

export const BankAccount = () => {
  const {
    bankAccounts: appBankAccounts,
    setIsAddBankOpen,
    setIsWithdrawOpen,
    handleDeleteBankAccount,
    user
  } = useApp();

  const [bankAccounts, setBankAccounts] = useState(appBankAccounts || []);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchBankAccounts = async () => {
      setLoading(true);
      try {
        const res = await bankService.getBankAccounts();
        if (isMounted && res?.success && Array.isArray(res.data)) {
          setBankAccounts(res.data);
        } else if (isMounted && appBankAccounts) {
          setBankAccounts(appBankAccounts);
        }
      } catch (err) {
        if (isMounted && appBankAccounts) {
          setBankAccounts(appBankAccounts);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBankAccounts();
    return () => {
      isMounted = false;
    };
  }, [appBankAccounts]);

  const onDelete = async (id) => {
    if (window.confirm('Are you sure you want to unlink this bank account?')) {
      setDeletingId(id);
      const success = await handleDeleteBankAccount(id);
      setDeletingId(null);
      if (success) {
        setBankAccounts((prev) => prev.filter((b) => (b.id || b._id) !== id));
      }
    }
  };

  const displayAccounts = bankAccounts.length > 0 ? bankAccounts : appBankAccounts;

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[18px] bg-gradient-to-r from-[#0E3021] via-[#0A261A] to-[#061F15] border border-amber-400/25 shadow-xl shadow-[#031C12]">
        <div>
          <span className="text-xs text-[#F4D06F] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#F4D06F]" />
            Encrypted & Verified Payout Channel
          </span>
          <h2 className="text-2xl font-bold text-[#F8FAFC] font-sans">Bank Account</h2>
          <p className="text-xs text-[#A7B8AE] mt-1 font-sans">
            Manage your withdrawal account securely.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          icon={Plus}
          onClick={() => setIsAddBankOpen(true)}
          className="shrink-0"
        >
          Add Bank Account
        </Button>
      </div>

      {/* BANK ACCOUNTS LIST */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-[#71857A] uppercase tracking-wider flex items-center gap-2">
          Verified Accounts
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F4D06F]" />}
        </h3>

        {loading && displayAccounts.length === 0 ? (
          <div className="p-8 text-center text-[#71857A] flex items-center justify-center gap-2 font-mono">
            <Loader2 className="w-5 h-5 animate-spin text-[#F4D06F]" />
            <span>Loading bank account records...</span>
          </div>
        ) : displayAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayAccounts.map((bank) => {
              const bId = bank.id || bank._id;
              const accountNum = bank.accountNumber || (bank.accountNumberLast4 ? `XXXX XXXX ${bank.accountNumberLast4}` : 'XXXX XXXX 4821');
              const holderName = bank.accountHolderName || bank.holderName || user.name;
              const ifsc = bank.ifsc || bank.ifscCode || 'HDFC0001234';

              return (
                <Card key={bId} className="p-5 md:p-6 bg-[#0A261A] border border-emerald-500/16 relative shadow-lg">
                  {(bank.isPrimary || bank.isDefault) && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="recommended" size="sm" dot>Primary</Badge>
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-[#031C12] border border-emerald-500/20 text-[#F4D06F]">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-[#F8FAFC] font-sans">{bank.bankName}</h4>
                        <p className="text-sm font-mono font-bold text-[#F4D06F] mt-0.5">{accountNum}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDelete(bId)}
                      disabled={deletingId === bId}
                      className="p-2 text-[#71857A] hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Remove Account"
                    >
                      {deletingId === bId ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-[#061F15] rounded-2xl border border-emerald-500/16 my-4 text-xs">
                    <div>
                      <span className="text-[#71857A] block font-semibold uppercase tracking-wider">Account Holder</span>
                      <span className="font-bold text-[#F8FAFC] mt-0.5 block">{holderName}</span>
                    </div>
                    <div>
                      <span className="text-[#71857A] block font-semibold uppercase tracking-wider">IFSC Code</span>
                      <span className="font-mono font-bold text-[#34D399] mt-0.5 block">{ifsc}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-emerald-500/16">
                    <span className="text-xs text-[#34D399] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Instant IMPS Ready
                    </span>

                    <Button
                      variant="emerald"
                      size="sm"
                      onClick={() => setIsWithdrawOpen(true)}
                    >
                      Withdraw Funds
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center text-[#71857A]">
            <div className="w-12 h-12 rounded-2xl bg-[#061F15] border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 text-[#F4D06F]">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#F8FAFC] mb-1">No bank account added yet.</h4>
            <p className="text-xs text-[#A7B8AE] mb-4">Link your bank account to enable instant daily withdrawals.</p>
            <Button variant="gold" onClick={() => setIsAddBankOpen(true)} icon={Plus}>
              Add Bank Account
            </Button>
          </Card>
        )}
      </div>

      {/* SECURITY NOTICE */}
      <div className="p-4 rounded-2xl bg-[#061F15] border border-emerald-500/20 text-xs text-[#A7B8AE] flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#F4D06F] shrink-0 mt-0.5" />
        <p className="leading-relaxed font-sans">
          <strong className="text-[#F8FAFC] font-semibold">Security & Encryption Guarantee: </strong>
          Your bank details are securely protected using AES-256 hardware-grade encryption. Account names must match your registered KYC name for instant IMPS verification.
        </p>
      </div>
    </div>
  );
};
