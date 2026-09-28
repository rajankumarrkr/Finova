import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { TransactionItem } from '../components/cards/TransactionItem';
import { Search, Filter, ArrowUpRight, TrendingUp, Gift, ArrowDownLeft } from 'lucide-react';

export const History = () => {
  const { transactions } = useApp();
  const location = useLocation();

  // Read URL query param if tab or search specified
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'all';
  const initialSearch = queryParams.get('search') || '';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const qTab = queryParams.get('tab');
    if (qTab) setActiveTab(qTab);
    const qSearch = queryParams.get('search');
    if (qSearch) setSearchQuery(qSearch);
  }, [location.search]);

  const tabs = [
    { id: 'all', label: 'All Activity', count: transactions.length },
    { id: 'investments', label: 'Investments', icon: ArrowUpRight, count: transactions.filter(t => t.category === 'Investments').length },
    { id: 'earnings', label: 'Daily Earnings', icon: TrendingUp, count: transactions.filter(t => t.category === 'Earnings').length },
    { id: 'withdrawals', label: 'Withdrawals', icon: ArrowDownLeft, count: transactions.filter(t => t.category === 'Withdrawals').length },
    { id: 'referrals', label: 'Referral Rewards', icon: Gift, count: transactions.filter(t => t.category === 'Referrals').length }
  ];

  // Filtering Logic
  const filteredTransactions = transactions.filter(txn => {
    // Tab filter
    if (activeTab === 'investments' && txn.category !== 'Investments') return false;
    if (activeTab === 'earnings' && txn.category !== 'Earnings') return false;
    if (activeTab === 'withdrawals' && txn.category !== 'Withdrawals') return false;
    if (activeTab === 'referrals' && txn.category !== 'Referrals') return false;

    // Status filter
    if (statusFilter !== 'all' && txn.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = txn.title.toLowerCase().includes(q);
      const matchRef = txn.reference ? txn.reference.toLowerCase().includes(q) : false;
      const matchAmount = txn.amount.toString().includes(q);
      if (!matchTitle && !matchRef && !matchAmount) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, ref code, amount..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-medium text-slate-300 focus:outline-none focus:border-emerald-500"
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
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(txn => (
            <TransactionItem key={txn.id} transaction={txn} />
          ))
        ) : (
          <Card className="p-12 text-center text-slate-400">
            <p className="text-sm">No transactions match your current search or filter criteria.</p>
            <button
              onClick={() => { setActiveTab('all'); setSearchQuery(''); setStatusFilter('all'); }}
              className="mt-3 text-xs font-semibold text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          </Card>
        )}
      </div>
    </div>
  );
};
