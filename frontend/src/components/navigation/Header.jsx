import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Bell, Search, User, Shield, HelpCircle } from 'lucide-react';

export const Header = () => {
  const { user, unreadCount, setIsSupportOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Contextual page titles based on active route
  const getPageMeta = () => {
    switch (location.pathname) {
      case '/plans':
        return { title: 'Investment Plans', subtitle: 'Choose a plan that fits your investment goals.' };
      case '/team':
        return { title: 'My Team', subtitle: 'Earn 10% referral rewards on team deposits.' };
      case '/profile':
        return { title: 'Account Profile', subtitle: 'Manage your portfolio settings and preferences.' };
      case '/history':
        return { title: 'Transaction History', subtitle: 'View detailed logs of all deposits, returns, and withdrawals.' };
      case '/bank-account':
        return { title: 'Linked Bank Account', subtitle: 'Manage verified bank accounts for instant payouts.' };
      case '/notifications':
        return { title: 'Notifications Center', subtitle: 'Stay updated with your latest earnings and account activity.' };
      default:
        return { title: 'Good afternoon, Rajan 👋', subtitle: "Here's your investment overview." };
    }
  };

  const meta = getPageMeta();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/history?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0B0F19]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-4 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Title & Greeting */}
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-white tracking-tight truncate font-sans">
            {meta.title}
          </h1>
          <p className="text-xs md:text-sm text-slate-400 truncate mt-0.5 font-sans">
            {meta.subtitle}
          </p>
        </div>

        {/* Right Actions & Search */}
        <div className="flex items-center gap-2.5 md:gap-4 shrink-0">
          {/* Search Input (Hidden on mobile, visible on desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:block relative w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plans, txns..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </form>

          {/* Help Button */}
          <button
            onClick={() => setIsSupportOpen(true)}
            className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all focus:outline-none"
            title="Help & Support"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Notification Button */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0B0F19] animate-pulse" />
            )}
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2.5 p-1 md:p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all focus:outline-none"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover ring-2 ring-emerald-500/30"
            />
            <span className="hidden lg:inline-block text-xs font-semibold text-slate-200 pr-1">
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
