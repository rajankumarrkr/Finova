import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { bankService } from '../services/bankService';
import { Building2, Plus, CheckCircle2, ShieldCheck, Trash2, Loader2 } from 'lucide-react';

export const BankAccount = () => {
  const {
    bankAccounts: appBankAccounts,
    setIsAddBankOpen,
    setIsWithdrawOpen,
    handleDeleteBankAccount,
    showToast,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl balance-card-bg border border-emerald-500/20">
        <div>
          <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4" />
            Verified Payout Channels
          </span>
          <h2 className="text-2xl font-bold text-white font-sans">Linked Bank Accounts</h2>
          <p className="text-xs text-slate-300 mt-1">
            Withdrawals are processed directly to your linked bank account via instant IMPS.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsAddBankOpen(true)}
          className="shrink-0"
        >
          Add New Account
        </Button>
      </div>

      {/* BANK ACCOUNTS LIST */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          Active Bank Accounts
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />}
        </h3>

        {loading && displayAccounts.length === 0 ? (
          <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            <span>Loading linked bank accounts...</span>
          </div>
        ) : displayAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayAccounts.map((bank) => {
              const bId = bank.id || bank._id;
              const accountNum = bank.accountNumber || (bank.accountNumberLast4 ? `XXXX XXXX ${bank.accountNumberLast4}` : 'XXXX XXXX 4521');
              const holderName = bank.accountHolderName || bank.holderName || user.name;
              const ifsc = bank.ifsc || bank.ifscCode || 'HDFC0001234';

              return (
                <Card key={bId} className="p-5 md:p-6 border-slate-800 relative">
                  {(bank.isPrimary || bank.isDefault) && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="emerald" size="sm" dot>Primary Account</Badge>
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{bank.bankName}</h4>
                        <p className="text-sm font-mono font-bold text-slate-200 mt-0.5">{accountNum}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDelete(bId)}
                      disabled={deletingId === bId}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Unlink Account"
                    >
                      {deletingId === bId ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 my-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Account Holder</span>
                      <span className="font-semibold text-slate-200 mt-0.5 block">{holderName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">IFSC Code</span>
                      <span className="font-mono font-semibold text-emerald-300 mt-0.5 block">{ifsc}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Instant IMPS Ready
                    </span>

                    <Button
                      variant="emerald"
                      size="sm"
                      onClick={() => setIsWithdrawOpen(true)}
                    >
                      Withdraw to this Bank
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center text-slate-400">
            <p className="text-sm">No linked bank accounts found.</p>
            <Button variant="primary" className="mt-3" onClick={() => setIsAddBankOpen(true)}>
              Add New Account
            </Button>
          </Card>
        )}
      </div>

      {/* SECURITY NOTICE */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300 font-semibold">Banking Security Protocol: </strong>
          For security compliance, bank account names must strictly match your KYC verified name ({user.name}). Withdrawals to third-party bank accounts will be automatically rejected.
        </p>
      </div>
    </div>
  );
};
