import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Users, User } from 'lucide-react';

export const BottomNavigation = () => {
  const navItems = [
    { label: 'Home', path: '/', icon: LayoutDashboard },
    { label: 'Plans', path: '/plans', icon: TrendingUp },
    { label: 'Team', path: '/team', icon: Users },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/90 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[64px] transition-all duration-200 ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10 font-bold'
                  : 'text-slate-400 font-medium hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[11px] leading-none">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
