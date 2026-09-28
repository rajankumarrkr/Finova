import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Bell,
  CheckCircle2,
  TrendingUp,
  Gift,
  ArrowDownLeft,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';

export const Notifications = () => {
  const { notifications, markAllNotificationsRead, markNotificationRead } = useApp();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'dollar':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'users':
        return <Gift className="w-5 h-5 text-purple-400" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'arrow-down':
        return <ArrowDownLeft className="w-5 h-5 text-amber-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'dollar':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'users':
        return 'bg-purple-500/10 border-purple-500/20';
      case 'trending':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'arrow-down':
        return 'bg-amber-500/10 border-amber-500/20';
      default:
        return 'bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-sans">Notifications Center</h2>
            <p className="text-xs text-slate-400">Stay updated on payouts, referrals, and security</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={CheckCheck}
          onClick={markAllNotificationsRead}
        >
          Mark All as Read
        </Button>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'all' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
          }`}
        >
          All Notifications ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'unread' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
          }`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>

        <button
          onClick={() => setFilter('read')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filter === 'read' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400'
          }`}
        >
          Read ({notifications.filter(n => n.read).length})
        </button>
      </div>

      {/* NOTIFICATIONS CARDS LIST */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                !notif.read
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'glass-panel border-slate-800/80 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border ${getIconBg(notif.iconType)} shrink-0 mt-0.5`}>
                    {getIcon(notif.iconType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white font-sans">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.description}</p>
                    <span className="text-[11px] font-mono text-slate-500 mt-2 block">{notif.timestamp}</span>
                  </div>
                </div>

                <Badge variant={notif.category === 'Earnings' ? 'emerald' : 'blue'} size="sm">
                  {notif.category}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <Card className="p-10 text-center text-slate-400">
            <p className="text-sm">No notifications found in this view.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
