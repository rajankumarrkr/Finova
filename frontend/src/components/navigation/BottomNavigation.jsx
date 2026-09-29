import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Users, History, User } from 'lucide-react';

export const BottomNavigation = () => {
  const navItems = [
    { label: 'Home', path: '/', icon: LayoutDashboard },
    { label: 'Plans', path: '/plans', icon: TrendingUp },
    { label: 'Team', path: '/team', icon: Users },
    { label: 'History', path: '/history', icon: History },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#061F15]/95 backdrop-blur-2xl border-t border-emerald-500/16 px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[56px] transition-all duration-200 ${
                isActive
                  ? 'text-[#F8FAFC] bg-[#0E3021] border border-emerald-500/30 font-bold'
                  : 'text-[#71857A] font-medium hover:text-[#F8FAFC]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mb-1 transition-transform ${isActive ? 'scale-110 text-[#F4D06F]' : 'text-[#71857A]'}`} />
                <span className={`text-[10px] leading-none ${isActive ? 'text-[#F4D06F] font-bold' : ''}`}>{item.label}</span>
                {isActive && (
                  <div className="absolute -top-1 w-2 h-1 bg-[#F4D06F] rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
