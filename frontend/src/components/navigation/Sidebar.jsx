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
  Shield,
  LogOut,
  Zap
} from 'lucide-react';

export const Sidebar = () => {
  const { openTelegramSupport, logout } = useApp();
  const navigate = useNavigate();

  const mainNavItems = [
    { label: 'Home', path: '/', icon: LayoutDashboard },
    { label: 'My Investment', path: '/my-investments', icon: Zap },
    { label: 'Plans', path: '/plans', icon: TrendingUp },
    { label: 'Team', path: '/team', icon: Users },
    { label: 'History', path: '/history', icon: History },
    { label: 'Bank Account', path: '/bank-account', icon: Building2 },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#061F15] border-r border-emerald-500/16 min-h-screen p-5 shrink-0 fixed top-0 left-0 bottom-0 z-40">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-3 py-2 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-amber-300 p-0.5 shadow-lg shadow-emerald-950/40">
          <div className="w-full h-full bg-[#031C12] rounded-[14px] flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#F4D06F]" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-[#F8FAFC] tracking-wider font-mono">FINOVA</h2>
          <p className="text-[10px] text-[#F4D06F] font-bold tracking-widest uppercase">WEALTH MANAGEMENT</p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="space-y-1.5 flex-1">
        <p className="text-[11px] font-bold text-[#71857A] uppercase tracking-wider px-3 mb-2">Main Menu</p>
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-[#0E3021] text-[#F8FAFC] border border-emerald-500/30 shadow-md shadow-[#031C12]'
                  : 'text-[#71857A] hover:text-[#F8FAFC] hover:bg-[#0A261A]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-[#10B981] to-[#F4D06F] rounded-r-full" />
                )}
                <div className="flex items-center gap-3 pl-1">
                  <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-[#F4D06F]' : 'text-[#71857A] group-hover:text-[#34D399]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-400/20 text-[#F4D06F] border border-amber-400/30">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="pt-4 border-t border-emerald-500/16 space-y-1.5">
        <p className="text-[11px] font-bold text-[#71857A] uppercase tracking-wider px-3 mb-2">Preferences</p>
        
        <button
          onClick={openTelegramSupport}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-[#71857A] hover:text-[#00E599] hover:bg-[#0A261A] transition-all cursor-pointer"
        >
          <HelpCircle className="w-5 h-5 shrink-0 text-[#71857A]" />
          <span>Help & Support</span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-[#71857A] hover:text-[#F8FAFC] hover:bg-[#0A261A] transition-all"
        >
          <Settings className="w-5 h-5 shrink-0 text-[#71857A]" />
          <span>Settings</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-rose-300 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
