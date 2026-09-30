import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { TransactionItem } from '../components/cards/TransactionItem';
import { Modal } from '../components/ui/Modal';
import { transactionService } from '../services/transactionService';
import { depositService } from '../services/depositService';
import { Search, Filter, ArrowUpRight, TrendingUp, Gift, ArrowDownLeft, Loader2, Wallet, FileImage } from 'lucide-react';
import { getMediaUrl, handleImageError } from '../utils/media';

export const History = () => {
  const { transactions: appTransactions } = useApp();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'all';
  const initialSearch = queryParams.get('search') || '';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  useEffect(() => {
    const qTab = queryParams.get('tab');
    if (qTab) setActiveTab(qTab);
    const qSearch = queryParams.get('search');
    if (qSearch) setSearchQuery(qSearch);
  }, [location.search]);

  useEffect(() => {
    let isMounted = true;

    const fetchTxns = async () => {
      setLoading(true);
      try {
        // Fetch wallet transactions and deposit requests in parallel
        const [txnRes, depRes] = await Promise.allSettled([
          transactionService.getTransactions({ limit: 100 }),
          depositService.getDepositHistory({ limit: 100 })
        ]);

        let combined = [];

        // 1. Process Wallet Ledger Transactions
        if (txnRes.status === 'fulfilled' && txnRes.value?.success) {
          const rawList = txnRes.value.data?.transactions || (Array.isArray(txnRes.value.data) ? txnRes.value.data : []);
          const formattedTxns = rawList.map((t) => {
            let category = 'Investments';
            if (t.type === 'deposit' || t.type === 'deposits') category = 'Deposits';
            else if (t.type === 'daily_earning' || t.type === 'earnings') category = 'Earnings';
            else if (t.type === 'withdrawal' || t.type === 'withdrawals') category = 'Withdrawals';
            else if (t.type === 'referral_bonus' || t.type === 'referrals') category = 'Referrals';

            return {
              id: t._id || t.transactionId,
              type: t.type,
              title: t.reference || t.type?.replace('_', ' ')?.toUpperCase() || 'Transaction',
              amount: t.amount,
              isPositive: t.direction === 'credit',
              date: t.createdAt ? new Date(t.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recently',
              rawDate: t.createdAt,
              status: t.status ? t.status.charAt(0).toUpperCase() + t.status.slice(1) : 'Completed',
              category,
              reference: t.transactionId || t.reference || '',
            };
          });
          combined.push(...formattedTxns);
        }

        // 2. Process Deposit Orders (including PENDING / VERIFICATION_PENDING)
        if (depRes.status === 'fulfilled' && depRes.value?.success && Array.isArray(depRes.value.deposits)) {
          const formattedDeposits = depRes.value.deposits.map((d) => ({
            id: d.id || d._id,
            type: 'deposit',
            title: `UPI Deposit (${d.paymentReference})`,
            amount: d.amount,
            isPositive: true,
            date: d.createdAt ? new Date(d.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recently',
            rawDate: d.createdAt,
            status: d.status === 'SUCCESS' ? 'Completed' : d.status === 'VERIFICATION_PENDING' ? 'Processing' : d.status === 'PENDING' ? 'Awaiting Proof' : 'Failed',
            category: 'Deposits',
            reference: d.paymentReference,
            paymentScreenshot: d.paymentScreenshot,
            utr: d.utr,
          }));

          for (const dep of formattedDeposits) {
            // Avoid duplicates if completed deposit is already in transaction ledger
            if (!combined.some((t) => t.reference === dep.reference || t.id === dep.id)) {
              combined.push(dep);
            }
          }
        }

        // Fallback to appTransactions if backend returned empty array
        if (combined.length === 0 && appTransactions && appTransactions.length > 0) {
          combined = [...appTransactions];
        }

        // 3. Client-Side Tab Filtering
        if (activeTab !== 'all') {
          const tabCatMap = {
            deposits: 'Deposits',
            investments: 'Investments',
            earnings: 'Earnings',
            withdrawals: 'Withdrawals',
            referrals: 'Referrals',
          };
          const targetCat = tabCatMap[activeTab] || activeTab;
          combined = combined.filter((t) => t.category.toLowerCase() === targetCat.toLowerCase());
        }

        // 4. Client-Side Status Filtering
        if (statusFilter !== 'all') {
          combined = combined.filter((t) => t.status.toLowerCase() === statusFilter.toLowerCase());
        }

        // 5. Client-Side Search Filtering
        if (searchQuery.trim()) {
          const s = searchQuery.trim().toLowerCase();
          combined = combined.filter(
            (t) =>
              t.title.toLowerCase().includes(s) ||
              (t.reference && t.reference.toLowerCase().includes(s)) ||
              t.amount.toString().includes(s)
          );
        }

        // Sort latest first
        combined.sort((a, b) => new Date(b.rawDate || 0) - new Date(a.rawDate || 0));

        if (isMounted) {
          setTransactions(combined);
        }
      } catch (err) {
        console.error('Error fetching transaction history:', err);
        if (isMounted && appTransactions) {
          setTransactions(appTransactions);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTxns();
    return () => {
      isMounted = false;
    };
  }, [activeTab, statusFilter, searchQuery, appTransactions]);

  const tabs = [
    { id: 'all', label: 'All Activity', count: transactions.length },
    { id: 'deposits', label: 'Deposits', icon: Wallet, count: transactions.filter((t) => t.category === 'Deposits').length },
    { id: 'investments', label: 'Investments', icon: ArrowUpRight, count: transactions.filter((t) => t.category === 'Investments').length },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp, count: transactions.filter((t) => t.category === 'Earnings').length },
    { id: 'withdrawals', label: 'Withdrawals', icon: ArrowDownLeft, count: transactions.filter((t) => t.category === 'Withdrawals').length },
    { id: 'referrals', label: 'Referrals', icon: Gift, count: transactions.filter((t) => t.category === 'Referrals').length },
  ];

  return (
    <div className="space-y-6">
      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71857A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, ref code, amount..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#061F15] border border-emerald-500/16 rounded-2xl text-xs text-[#F8FAFC] placeholder-[#71857A] focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[#71857A] shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-[#061F15] border border-emerald-500/16 rounded-2xl text-xs font-semibold text-[#F8FAFC] focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Status: All</option>
              <option value="completed">Status: Completed</option>
              <option value="processing">Status: Processing</option>
              <option value="failed">Status: Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* TRANSACTION LIST */}
      <div className="space-y-2">
        {loading ? (
          <div className="p-12 text-center text-[#71857A] flex items-center justify-center gap-2 font-mono">
            <Loader2 className="w-5 h-5 animate-spin text-[#F4D06F]" />
            <span>Loading transaction records...</span>
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((txn) => (
            <TransactionItem
              key={txn.id}
              transaction={txn}
              onClick={() => setSelectedTxn(txn)}
            />
          ))
        ) : (
          <Card className="p-12 text-center text-[#71857A]">
            <p className="text-sm font-sans">No transactions match your current search or filter criteria.</p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="mt-3 text-xs font-bold text-[#34D399] hover:underline"
            >
              Reset Filters
            </button>
          </Card>
        )}
      </div>

      {/* Transaction & Proof Details Modal */}
      {selectedTxn && (
        <Modal
          isOpen={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          title="Transaction Details"
          subtitle={`Reference: ${selectedTxn.reference || selectedTxn.id}`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-[#061F15] border border-emerald-500/20 rounded-2xl space-y-2.5">
              <div className="flex justify-between items-center text-xs text-[#A7B8AE]">
                <span>Type:</span>
                <span className="font-semibold text-white capitalize">{selectedTxn.category || selectedTxn.type}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#A7B8AE]">
                <span>Amount:</span>
                <span className="font-mono font-bold text-base text-[#F4D06F]">
                  ₹{Number(selectedTxn.amount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#A7B8AE]">
                <span>Date & Time:</span>
                <span className="text-white">{selectedTxn.date}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#A7B8AE]">
                <span>Status:</span>
                <span className={`font-semibold ${
                  selectedTxn.status === 'Completed' ? 'text-emerald-400' :
                  selectedTxn.status === 'Processing' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {selectedTxn.status}
                </span>
              </div>
              {selectedTxn.utr && (
                <div className="flex justify-between items-center text-xs text-[#A7B8AE]">
                  <span>UTR / Reference:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedTxn.utr}</span>
                </div>
              )}
            </div>

            {/* Proof Screenshot Section if available */}
            {selectedTxn.paymentScreenshot ? (
              <div className="p-4 bg-[#061F15] border border-emerald-500/25 rounded-2xl space-y-2.5">
                <span className="text-xs font-mono font-bold text-[#F4D06F] flex items-center gap-1.5">
                  <FileImage className="w-4 h-4" /> Attached Payment Proof Screenshot
                </span>
                <div className="rounded-xl overflow-hidden border border-emerald-500/30 bg-[#031C12] p-1.5 flex items-center justify-center">
                  <img
                    src={getMediaUrl(selectedTxn.paymentScreenshot, 'proof')}
                    alt="Payment Proof Screenshot"
                    onError={(e) => handleImageError(e, 'proof')}
                    className="max-h-72 w-full object-contain rounded-lg"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </Modal>
      )}
    </div>
  );
};
