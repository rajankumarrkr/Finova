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
  Link2,
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
  const [copiedLink, setCopiedLink] = useState(false);
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

  const referralCode = user.referralCode || 'FINOVA123';
  
  // Safe Frontend Client URL Resolver
  const getAppUrl = () => {
    // 1. Current browser window origin is always the true frontend origin
    if (typeof window !== 'undefined' && window.location?.origin) {
      const origin = window.location.origin;
      // Safety check: ensure origin is not the backend API URL
      if (!origin.includes('onrender.com') && !origin.includes(':5000')) {
        return origin.replace(/\/+$/, '');
      }
    }

    // 2. VITE_APP_URL env variable fallback (clean /api or trailing slashes)
    let envAppUrl = import.meta.env.VITE_APP_URL;
    if (envAppUrl && typeof envAppUrl === 'string') {
      envAppUrl = envAppUrl.trim().replace(/\/+$/, '');
      if (envAppUrl.endsWith('/api')) {
        envAppUrl = envAppUrl.slice(0, -4);
      }
      if (!envAppUrl.includes('onrender.com') && !envAppUrl.includes(':5000')) {
        return envAppUrl;
      }
    }

    // 3. Fallback to production frontend domain
    return 'https://finova-sage.vercel.app';
  };

  const appUrl = getAppUrl();
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
        // Keep initial fallbacks
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

  const handleCopyLink = () => {
    copyToClipboard(referralUrl, () => {
      setCopiedLink(true);
      showToast('Referral link copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Join Finova Wealth',
      text: `Join Finova with my referral link and get exclusive investment perks:\n${referralUrl}`,
      url: referralUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
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
      <div className="p-6 md:p-8 rounded-[18px] bg-gradient-to-r from-[#0E3021] via-[#0A261A] to-[#061F15] border border-amber-400/25 shadow-xl shadow-[#031C12] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-[#F4D06F] text-xs font-bold font-mono uppercase mb-3">
              <Gift className="w-3.5 h-3.5" />
              10% Instant Referral Reward
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-[#F8FAFC] font-sans">
              Team Overview
            </h2>
            <p className="text-sm text-[#A7B8AE] mt-1 max-w-xl font-sans">
              Earn an instant 10% direct reward credited straight to your withdrawable balance whenever your invited team members activate any plan.
            </p>

            {/* Code & Share Box */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-[#031C12] border border-amber-400/30 rounded-2xl">
                <span className="text-xs text-[#71857A] font-semibold uppercase tracking-wider">Referral Code:</span>
                <span className="font-mono text-lg font-black text-[#F4D06F] tracking-wider">
                  {referralCode}
                </span>
              </div>

              <Button
                variant="gold"
                size="md"
                icon={copied ? CheckCircle2 : Copy}
                onClick={handleCopyCode}
              >
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>

              <Button
                variant="secondary"
                size="md"
                icon={copiedLink ? CheckCircle2 : Link2}
                onClick={handleCopyLink}
              >
                {copiedLink ? 'Link Copied!' : 'Copy Link'}
              </Button>

              <Button
                variant="outline"
                size="md"
                icon={Share2}
                onClick={handleShare}
              >
                Share
              </Button>
            </div>

            {/* Referral Link Display */}
            <div className="mt-3 flex items-center gap-2 max-w-xl">
              <div className="flex-1 truncate px-3.5 py-2 bg-[#031C12]/90 border border-emerald-500/20 rounded-xl text-xs font-mono text-[#A7B8AE] select-all">
                {referralUrl}
              </div>
            </div>
          </div>

          {/* Large Reward Badge */}
          <div className="p-5 rounded-2xl bg-[#061F15] border border-emerald-500/16 text-center shrink-0 min-w-[200px]">
            <span className="text-xs text-[#71857A] uppercase font-bold tracking-wider">Referral Reward Rate</span>
            <div className="text-4xl font-black text-[#F4D06F] font-mono mt-1">
              10%
            </div>
            <p className="text-[11px] text-[#A7B8AE] mt-1 font-mono">Instant Payout</p>
          </div>
        </div>
      </div>

      {/* TEAM STATISTICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Referrals"
          value={stats.totalTeam?.toString() || '0'}
          subtitle="Direct & Indirect network"
          icon={Users}
          iconColor="text-[#F4D06F]"
          iconBg="bg-amber-400/10 border-amber-400/25"
        />

        <StatCard
          title="Active Members"
          value={stats.activeTeam?.toString() || '0'}
          subtitle="Currently running plans"
          icon={UserCheck}
          iconColor="text-[#34D399]"
          iconBg="bg-emerald-500/15 border-emerald-500/30"
          valueColor="text-[#34D399]"
          trend="Active Network"
          trendType="up"
        />

        <StatCard
          title="Pending Rewards"
          value="₹0.00"
          subtitle="Pending verification"
          icon={UserX}
          iconColor="text-[#71857A]"
          iconBg="bg-[#0A261A] border-emerald-500/16"
          valueColor="text-[#A7B8AE]"
        />

        <StatCard
          title="Referral Earnings"
          value={formatCurrency(stats.totalReferralEarnings || user.balances?.referralEarnings || 0)}
          subtitle="Total rewards earned"
          icon={PiggyBank}
          iconColor="text-[#F4D06F]"
          iconBg="bg-amber-400/10 border-amber-400/25"
          valueColor="text-[#F4D06F]"
          highlight={true}
        />
      </div>

      {/* TEAM MEMBER LIST SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#F8FAFC] font-sans flex items-center gap-2">
              Team Directory
              {loading && <Loader2 className="w-4 h-4 animate-spin text-[#F4D06F]" />}
            </h3>
            <p className="text-xs text-[#A7B8AE]">List of users registered with your referral code</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71857A]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search member by name..."
              className="w-full pl-10 pr-4 py-2 bg-[#061F15] border border-emerald-500/16 rounded-2xl text-xs text-[#F8FAFC] placeholder-[#71857A] focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="p-8 text-center text-[#71857A] flex items-center justify-center gap-2 font-mono">
              <Loader2 className="w-5 h-5 animate-spin text-[#F4D06F]" />
              <span>Fetching team members...</span>
            </div>
          ) : filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <TeamMemberItem key={member.id} member={member} />
            ))
          ) : (
            <Card className="p-8 text-center text-[#71857A]">
              <p className="text-sm">No team members registered yet.</p>
              <p className="text-xs text-[#A7B8AE] mt-1 font-mono">
                Share your referral code <strong className="text-[#F4D06F]">{referralCode}</strong> to start earning 10% rewards!
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* REFERRAL REWARD HISTORY */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-[#F8FAFC] font-sans">Referral Reward History</h3>
        {displayHistory.length > 0 ? (
          <Card className="p-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-500/16 text-[#71857A] font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Member</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Reward Earned</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/16">
                {displayHistory.map((item, idx) => {
                  const mName = item.referredUser?.name || item.memberName || 'Team Member';
                  const rAmount = item.rewardAmount ? formatCurrency(item.rewardAmount) : item.reward;
                  const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.date || 'Recently');
                  return (
                    <tr key={item._id || item.id || idx} className="hover:bg-[#061F15] transition-colors">
                      <td className="py-3.5 pl-2 font-bold text-[#F8FAFC]">{mName}</td>
                      <td className="py-3.5 text-[#A7B8AE] font-mono">{item.action || '10% Reward'}</td>
                      <td className="py-3.5 text-[#F4D06F] font-mono font-bold">{rAmount}</td>
                      <td className="py-3.5 text-[#71857A] font-mono">{dateStr}</td>
                      <td className="py-3.5 text-right pr-2">
                        <Badge variant="gold" size="sm">{item.status || 'Credited'}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        ) : (
          <Card className="p-8 text-center text-[#71857A]">
            <p className="text-sm">No referral reward history yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
