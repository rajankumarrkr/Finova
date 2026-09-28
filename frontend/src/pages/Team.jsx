import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { TeamMemberItem } from '../components/cards/TeamMemberItem';
import { formatCurrency, copyToClipboard } from '../utils/formatters';
import {
  teamStatsData,
  teamMembersList,
  referralHistoryList
} from '../data/mockData';
import {
  Copy,
  Share2,
  Users,
  UserCheck,
  UserX,
  PiggyBank,
  CheckCircle2,
  Gift,
  Sparkles,
  Search
} from 'lucide-react';

export const Team = () => {
  const { user, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const referralCode = user.referralCode || 'RAJAN50';

  const handleCopyCode = () => {
    copyToClipboard(referralCode, () => {
      setCopied(true);
      showToast(`Referral code ${referralCode} copied to clipboard!`, 'success');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Join Finova Wealth',
      text: `Use my referral code ${referralCode} to get exclusive investment perks on Finova!`,
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyCode();
        }
      }
    } else {
      handleCopyCode();
    }
  };

  const filteredMembers = teamMembersList.filter(member =>
    member.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    member.email.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* REFERRAL PROMO CARD */}
      <Card gradient gradientColor="purple" className="relative overflow-hidden p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
              <Gift className="w-3.5 h-3.5" />
              10% Instant Referral Commission
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-sans">
              Invite Friends & Grow Together
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Earn an instant 10% direct reward credited straight to your withdrawable balance whenever your invited team members activate any plan.
            </p>

            {/* Code & Share Box */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-950/80 border border-purple-500/30 rounded-2xl">
                <span className="text-xs text-slate-400 font-medium">Your Code:</span>
                <span className="font-mono text-lg font-black text-purple-300 tracking-wider">
                  {referralCode}
                </span>
              </div>

              <Button
                variant="emerald"
                size="md"
                icon={copied ? CheckCircle2 : Copy}
                onClick={handleCopyCode}
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>

              <Button
                variant="glass"
                size="md"
                icon={Share2}
                onClick={handleShare}
              >
                Share Link
              </Button>
            </div>
          </div>

          {/* Large Reward Badge */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center shrink-0 min-w-[200px]">
            <span className="text-xs text-slate-400 uppercase font-medium">Referral Commission</span>
            <div className="text-4xl font-black text-emerald-400 font-mono mt-1">
              10%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Unlimited payouts</p>
          </div>
        </div>
      </Card>

      {/* TEAM STATISTICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Team"
          value={teamStatsData.totalTeam.toString()}
          subtitle="Direct & Indirect network"
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10 border-blue-500/20"
        />

        <StatCard
          title="Active Members"
          value={teamStatsData.activeTeam.toString()}
          subtitle="Currently running plans"
          icon={UserCheck}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          trend="72% Activity Rate"
          trendType="up"
        />

        <StatCard
          title="Inactive Members"
          value={teamStatsData.inactiveTeam.toString()}
          subtitle="Registered without plan"
          icon={UserX}
          iconColor="text-slate-400"
          iconBg="bg-slate-800 border-slate-700"
        />

        <StatCard
          title="Referral Earnings"
          value={formatCurrency(user.balances.referralEarnings)}
          subtitle="Rewards from eligible referrals"
          icon={PiggyBank}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10 border-purple-500/20"
          highlight={true}
        />
      </div>

      {/* TEAM MEMBER LIST SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white font-sans">Team Members Directory</h3>
            <p className="text-xs text-slate-400">List of users who registered with your code</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search member by name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredMembers.length > 0 ? (
            filteredMembers.map(member => (
              <TeamMemberItem key={member.id} member={member} />
            ))
          ) : (
            <Card className="p-8 text-center text-slate-400">
              <p className="text-sm">No team members registered yet.</p>
              <p className="text-xs text-slate-500 mt-1">Share your referral code <strong className="text-purple-300 font-mono">{referralCode}</strong> to start earning 10% commission!</p>
            </Card>
          )}
        </div>
      </div>

      {/* REFERRAL REWARD HISTORY */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white font-sans">Referral Reward History</h3>
        {referralHistoryList.length > 0 ? (
          <Card className="p-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Member</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Reward Earned</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {referralHistoryList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 pl-2 font-semibold text-white">{item.memberName}</td>
                    <td className="py-3.5 text-slate-300 font-mono">{item.action}</td>
                    <td className="py-3.5 text-purple-400 font-mono font-bold">{item.reward}</td>
                    <td className="py-3.5 text-slate-400">{item.date}</td>
                    <td className="py-3.5 text-right pr-2">
                      <Badge variant="emerald" size="sm">{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <Card className="p-8 text-center text-slate-400">
            <p className="text-sm">No referral reward history yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

