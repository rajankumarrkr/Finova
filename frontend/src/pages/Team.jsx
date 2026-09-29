import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { TeamMemberItem } from '../components/cards/TeamMemberItem';
import { formatCurrency, copyToClipboard } from '../utils/formatters';
import { teamMembersList, referralHistoryList } from '../data/mockData';
import * as referralService from '../services/referralService';
import {
  Copy,
  Share2,
  Users,
  UserCheck,
  UserX,
  PiggyBank,
  CheckCircle2,
  Gift,
  Search,
  Loader2
} from 'lucide-react';

export const Team = () => {
  const { user, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalTeam: 0,
    activeTeam: 0,
    inactiveTeam: 0,
    totalReferralEarnings: user.balances?.referralEarnings || 0,
  });

  const [members, setMembers] = useState([]);
  const [history, setHistory] = useState([]);

  const referralCode = user.referralCode || 'REFCODE';
  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const referralUrl = `${appUrl}/register?ref=${referralCode}`;

  useEffect(() => {
    let isMounted = true;
    const fetchReferralData = async () => {
      setLoading(true);
      try {
        const [statsRes, historyRes] = await Promise.allSettled([
          referralService.getReferralStats(),
          referralService.getReferralHistory(),
        ]);

        if (isMounted) {
          if (statsRes.status === 'fulfilled' && statsRes.value?.success && statsRes.value?.data) {
            setStats(statsRes.value.data);
          }

          if (historyRes.status === 'fulfilled' && historyRes.value?.success && Array.isArray(historyRes.value.data)) {
            const rawList = historyRes.value.data;
            setHistory(rawList);

            // Format members from populated referral docs if present
            const formattedMembers = rawList.map((item, idx) => {
              const u = item.referredUser || {};
              return {
                id: u._id || item._id || `MBR-${idx}`,
                name: u.name || item.memberName || 'Team Member',
                email: u.email || `${u.phone || 'member'}@finova.app`,
                phone: u.phone || 'N/A',
                joinedDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently',
                activePlan: u.wallet?.totalInvested > 0 ? 'Active Plan' : 'Registered Only',
                totalInvested: u.wallet?.totalInvested || 0,
                commissionEarned: item.rewardAmount || 0,
                status: u.wallet?.totalInvested > 0 ? 'Active' : 'Inactive',
                avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name || idx}`,
              };
            });
            if (formattedMembers.length > 0) {
              setMembers(formattedMembers);
            }
          }
        }
      } catch (err) {
        // Keep initial empty/mock fallbacks if backend returns 0 members
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReferralData();
    return () => {
      isMounted = false;
    };
  }, []);

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
      url: referralUrl,
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

  const displayMembers = members.length > 0 ? members : (loading ? [] : teamMembersList);
  const displayHistory = history.length > 0 ? history : (loading ? [] : referralHistoryList);

  const filteredMembers = displayMembers.filter((member) =>
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
          value={stats.totalTeam?.toString() || '0'}
          subtitle="Direct & Indirect network"
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10 border-blue-500/20"
        />

        <StatCard
          title="Active Members"
          value={stats.activeTeam?.toString() || '0'}
          subtitle="Currently running plans"
          icon={UserCheck}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          trend="Live Team Data"
          trendType="up"
        />

        <StatCard
          title="Inactive Members"
          value={stats.inactiveTeam?.toString() || '0'}
          subtitle="Registered without plan"
          icon={UserX}
          iconColor="text-slate-400"
          iconBg="bg-slate-800 border-slate-700"
        />

        <StatCard
          title="Referral Earnings"
          value={formatCurrency(stats.totalReferralEarnings || user.balances?.referralEarnings || 0)}
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
            <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
              Team Members Directory
              {loading && <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />}
            </h3>
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
          {loading ? (
            <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              <span>Fetching team members...</span>
            </div>
          ) : filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <TeamMemberItem key={member.id} member={member} />
            ))
          ) : (
            <Card className="p-8 text-center text-slate-400">
              <p className="text-sm">No team members registered yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Share your referral code <strong className="text-purple-300 font-mono">{referralCode}</strong> to start earning 10% commission!
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* REFERRAL REWARD HISTORY */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white font-sans">Referral Reward History</h3>
        {displayHistory.length > 0 ? (
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
                {displayHistory.map((item, idx) => {
                  const mName = item.referredUser?.name || item.memberName || 'Team Member';
                  const rAmount = item.rewardAmount ? formatCurrency(item.rewardAmount) : item.reward;
                  const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.date || 'Recently');
                  return (
                    <tr key={item._id || item.id || idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 pl-2 font-semibold text-white">{mName}</td>
                      <td className="py-3.5 text-slate-300 font-mono">{item.action || '10% Commission'}</td>
                      <td className="py-3.5 text-purple-400 font-mono font-bold">{rAmount}</td>
                      <td className="py-3.5 text-slate-400">{dateStr}</td>
                      <td className="py-3.5 text-right pr-2">
                        <Badge variant="emerald" size="sm">{item.status || 'Credited'}</Badge>
                      </td>
                    </tr>
                  );
                })}
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
