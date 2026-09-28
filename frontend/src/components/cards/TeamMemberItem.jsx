import React from 'react';
import { Badge } from '../ui/Badge';
import { Calendar, Award } from 'lucide-react';

export const TeamMemberItem = ({ member }) => {
  const { name, email, status, investment, joinedDate, avatar, rewardEarned } = member;
  const isActive = status === 'Active';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 md:p-4 rounded-2xl glass-panel-interactive border-slate-800/80 mb-2.5 gap-3">
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover ring-2 ring-slate-700/80 shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white truncate font-sans">{name}</h4>
            <Badge variant={isActive ? 'emerald' : 'slate'} size="sm" dot={isActive}>
              {status}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 truncate">{email}</p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/60">
        <div className="sm:text-right">
          <span className="text-[11px] text-slate-400 block font-medium">Investment</span>
          <span className="font-mono font-bold text-slate-200">{investment}</span>
        </div>

        <div className="sm:text-right">
          <span className="text-[11px] text-slate-400 block font-medium">Joined Date</span>
          <span className="text-slate-300 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            {joinedDate}
          </span>
        </div>

        {rewardEarned && rewardEarned !== '₹0' && (
          <div className="sm:text-right bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-xl">
            <span className="text-[10px] text-purple-300 block font-semibold">Reward Earned</span>
            <span className="font-mono font-bold text-purple-400">{rewardEarned}</span>
          </div>
        )}
      </div>
    </div>
  );
};
