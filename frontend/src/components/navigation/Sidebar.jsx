import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  User,
  History,
  Building2,
  HelpCircle,
  Settings,
  Sparkles,
  LogOut,
  Bell
} from 'lucide-react';

export const Sidebar = () => {
  const { setIsSupportOpen, unreadCount, logout } = useApp();
  const navigate = useNavigate();

  const mainNavItems = [
    { label: 'Home', path: '/', icon: LayoutDashboard },
    { label: 'Plans', path: '/plans', icon: TrendingUp },
    { label: 'Team', path: '/team', icon: Users },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'History', path: '/history', icon: History },
    { label: 'Bank Account', path: '/bank-account', icon: Building2 },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0B0F19] border-r border-slate-800/80 min-h-screen p-5 shrink-0 fixed top-0 left-0 bottom-0 z-40">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-3 py-2 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
          <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-wider font-mono">FINOVA</h2>
          <p className="text-[10px] text-emerald-400 font-semibold tracking-widest uppercase">PREMIUM WEALTH</p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="space-y-1.5 flex-1">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Main Menu</p>
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-md shadow-emerald-500/5'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </div>
            {item.badge > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="pt-4 border-t border-slate-800/80 space-y-1.5">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Preferences</p>
        
        <button
          onClick={() => setIsSupportOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 transition-all"
        >
          <HelpCircle className="w-5 h-5 shrink-0 text-slate-400" />
          <span>Help & Support</span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 transition-all"
        >
          <Settings className="w-5 h-5 shrink-0 text-slate-400" />
          <span>Settings</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
