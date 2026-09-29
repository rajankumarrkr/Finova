import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { TransactionItem } from '../components/cards/TransactionItem';
import { transactionService } from '../services/transactionService';
import { Search, Filter, ArrowUpRight, TrendingUp, Gift, ArrowDownLeft, Loader2 } from 'lucide-react';

export const History = () => {
  const { transactions: appTransactions } = useApp();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'all';
  const initialSearch = queryParams.get('search') || '';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('all');
  const [transactions, setTransactions] = useState(appTransactions || []);
  const [loading, setLoading] = useState(false);

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
        const query = {};
        if (activeTab !== 'all') {
          const tabCatMap = {
            investments: 'Investments',
            earnings: 'Earnings',
            withdrawals: 'Withdrawals',
            referrals: 'Referrals',
          };
          query.category = tabCatMap[activeTab] || activeTab;
        }
        if (statusFilter !== 'all') {
          query.status = statusFilter;
        }
        if (searchQuery.trim()) {
          query.search = searchQuery.trim();
        }

        const res = await transactionService.getTransactions(query);
        if (isMounted && res?.success) {
          const rawList = res.data?.transactions || (Array.isArray(res.data) ? res.data : []);
          const formatted = rawList.map((t) => {
            let category = 'Investments';
            if (t.type === 'daily_earning' || t.type === 'earnings') category = 'Earnings';
            else if (t.type === 'withdrawal' || t.type === 'withdrawals') category = 'Withdrawals';
            else if (t.type === 'referral_bonus' || t.type === 'referrals') category = 'Referrals';

            return {
              id: t._id || t.transactionId,
              type: t.type,
              title: t.reference || t.type?.replace('_', ' ')?.toUpperCase() || 'Transaction',
              amount: t.amount,
              isPositive: t.direction === 'credit',
              date: t.createdAt ? new Date(t.createdAt).toLocaleString() : 'Recently',
              rawDate: t.createdAt,
              status: t.status ? t.status.charAt(0).toUpperCase() + t.status.slice(1) : 'Completed',
              category,
              reference: t.transactionId || t.reference || '',
            };
          });
          setTransactions(formatted);
        }
      } catch (err) {
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
            <TransactionItem key={txn.id} transaction={txn} />
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
    </div>
  );
};
