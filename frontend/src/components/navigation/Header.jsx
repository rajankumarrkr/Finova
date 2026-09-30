import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, HelpCircle } from 'lucide-react';

export const Header = () => {
  const { user, setIsSupportOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const getDynamicGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = 'Good Morning';
    if (hour >= 12 && hour < 17) {
      timeGreeting = 'Good Afternoon';
    } else if (hour >= 17) {
      timeGreeting = 'Good Evening';
    }
    const firstName = user?.name ? user.name.split(' ')[0] : 'Investor';
    return `${timeGreeting}, ${firstName}`;
  };

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/plans':
        return { title: 'Investment Plans', subtitle: 'Choose a plan that fits your financial goals.' };
      case '/team':
        return { title: 'Team Overview', subtitle: 'Track your team referrals and earn 10% lifetime rewards.' };
      case '/profile':
        return { title: 'Investor Profile', subtitle: 'Manage your portfolio settings and security preferences.' };
      case '/history':
        return { title: 'Transaction History', subtitle: 'Detailed logs of all deposits, daily returns, and payouts.' };
      case '/bank-account':
        return { title: 'Bank Account', subtitle: 'Manage your withdrawal account securely.' };
      default:
        return { title: getDynamicGreeting(), subtitle: "Here's your investment overview" };
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
    <header className="sticky top-0 z-30 w-full bg-[#061F15]/90 backdrop-blur-xl border-b border-emerald-500/16 px-4 md:px-8 py-4 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Title & Greeting */}
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-[#F8FAFC] tracking-tight truncate font-sans">
            {meta.title}
          </h1>
          <p className="text-xs md:text-sm text-[#A7B8AE] truncate mt-0.5 font-sans">
            {meta.subtitle}
          </p>
        </div>

        {/* Right Actions & Search */}
        <div className="flex items-center gap-2.5 md:gap-4 shrink-0">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="hidden md:block relative w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71857A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plans, txns..."
              className="w-full pl-10 pr-4 py-2 bg-[#031C12] border border-emerald-500/16 rounded-2xl text-xs text-[#F8FAFC] placeholder-[#71857A] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </form>

          {/* Help Button */}
          <button
            onClick={() => setIsSupportOpen(true)}
            className="p-2.5 rounded-2xl bg-[#031C12] border border-emerald-500/16 text-[#71857A] hover:text-[#F8FAFC] hover:bg-[#0A261A] transition-all focus:outline-none"
            title="Help & Support"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2.5 p-1 md:p-1.5 rounded-2xl bg-[#031C12] border border-emerald-500/16 hover:border-amber-400/40 transition-all focus:outline-none"
          >
            <img
              src={typeof user.avatar === 'object' ? user.avatar?.url : (user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80')}
              alt={user.name}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover ring-2 ring-gradient-to-r ring-[#10B981] p-0.5"
            />
            <span className="hidden lg:inline-block text-xs font-bold text-[#F8FAFC] pr-1">
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
