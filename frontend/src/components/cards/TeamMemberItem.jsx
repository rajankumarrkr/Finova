import React from 'react';
import { Badge } from '../ui/Badge';
import { Calendar } from 'lucide-react';

export const TeamMemberItem = ({ member }) => {
  const { name, email, status, investment, joinedDate, avatar, rewardEarned } = member;
  const isActive = status === 'Active';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 md:p-4 rounded-2xl bg-[#0A261A] border border-emerald-500/16 hover:border-emerald-500/30 transition-all duration-200 mb-2.5 gap-3">
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[#F8FAFC] truncate font-sans">{name}</h4>
            <Badge variant={isActive ? 'emerald' : 'slate'} size="sm" dot={isActive}>
              {status}
            </Badge>
          </div>
          <p className="text-xs text-[#A7B8AE] truncate">{email}</p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-500/16">
        <div className="sm:text-right">
          <span className="text-[11px] text-[#71857A] block font-semibold uppercase tracking-wider">Investment</span>
          <span className="font-mono font-bold text-[#F8FAFC]">{investment}</span>
        </div>

        <div className="sm:text-right">
          <span className="text-[11px] text-[#71857A] block font-semibold uppercase tracking-wider">Joined Date</span>
          <span className="text-[#A7B8AE] flex items-center gap-1 font-mono">
            <Calendar className="w-3 h-3 text-[#71857A]" />
            {joinedDate}
          </span>
        </div>

        {rewardEarned && rewardEarned !== '₹0' && (
          <div className="sm:text-right bg-amber-400/10 border border-amber-400/25 px-2.5 py-1 rounded-xl">
            <span className="text-[10px] text-[#F4D06F] block font-bold uppercase tracking-wider">Reward</span>
            <span className="font-mono font-bold text-[#F4D06F]">{rewardEarned}</span>
          </div>
        )}
      </div>
    </div>
  );
};
