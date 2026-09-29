import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { notificationService } from '../services/notificationService';
import {
  Bell,
  TrendingUp,
  Gift,
  ArrowDownLeft,
  ShieldCheck,
  CheckCheck,
  Loader2
} from 'lucide-react';

export const Notifications = () => {
  const {
    notifications: appNotifications,
    markAllNotificationsRead,
    markNotificationRead
  } = useApp();

  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(appNotifications || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchNotifs = async () => {
      setLoading(true);
      try {
        const res = await notificationService.getNotifications();
        if (isMounted && res?.success && Array.isArray(res.data)) {
          const formatted = res.data.map((n) => ({
            id: n._id || n.id,
            title: n.title,
            description: n.message || n.description,
            timestamp: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            read: n.isRead ?? n.read ?? false,
            category: n.category || 'General',
            iconType: n.type || n.iconType || 'dollar',
          }));
          setNotifications(formatted);
        } else if (isMounted && appNotifications) {
          setNotifications(appNotifications);
        }
      } catch (err) {
        if (isMounted && appNotifications) {
          setNotifications(appNotifications);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNotifs();
    return () => {
      isMounted = false;
    };
  }, [appNotifications]);

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'dollar':
        return <TrendingUp className="w-5 h-5 text-[#34D399]" />;
      case 'users':
        return <Gift className="w-5 h-5 text-[#F4D06F]" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5 text-[#F4D06F]" />;
      case 'arrow-down':
        return <ArrowDownLeft className="w-5 h-5 text-rose-300" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#34D399]" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'dollar':
        return 'bg-emerald-500/15 border-emerald-500/30';
      case 'users':
      case 'trending':
        return 'bg-amber-400/15 border-amber-400/30';
      case 'arrow-down':
        return 'bg-rose-500/15 border-rose-500/30';
      default:
        return 'bg-[#123A29] border-emerald-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#061F15] border border-emerald-500/20 text-[#F4D06F]">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#F8FAFC] font-sans flex items-center gap-2">
              Notifications Center
              {loading && <Loader2 className="w-4 h-4 animate-spin text-[#F4D06F]" />}
            </h2>
            <p className="text-xs text-[#A7B8AE]">Stay updated on payouts, referrals, and account security</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={CheckCheck}
          onClick={handleMarkAllRead}
        >
          Mark All as Read
        </Button>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 p-1 bg-[#061F15] border border-emerald-500/16 rounded-2xl w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
            filter === 'all' ? 'bg-[#123A29] text-[#F4D06F] border border-emerald-500/30' : 'text-[#71857A]'
          }`}
        >
          All Notifications ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
            filter === 'unread' ? 'bg-[#123A29] text-[#F4D06F] border border-emerald-500/30' : 'text-[#71857A]'
          }`}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </button>

        <button
          onClick={() => setFilter('read')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
            filter === 'read' ? 'bg-[#123A29] text-[#F4D06F] border border-emerald-500/30' : 'text-[#71857A]'
          }`}
        >
          Read ({notifications.filter((n) => n.read).length})
        </button>
      </div>

      {/* NOTIFICATIONS CARDS LIST */}
      <div className="space-y-3">
        {loading && notifications.length === 0 ? (
          <div className="p-10 text-center text-[#71857A] flex items-center justify-center gap-2 font-mono">
            <Loader2 className="w-5 h-5 animate-spin text-[#F4D06F]" />
            <span>Loading notifications...</span>
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                !notif.read
                  ? 'bg-[#0A261A] border-amber-400/40 shadow-lg shadow-[#031C12]'
                  : 'bg-[#061F15] border-emerald-500/16 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border ${getIconBg(notif.iconType)} shrink-0 mt-0.5`}>
                    {getIcon(notif.iconType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#F8FAFC] font-sans">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#F4D06F] animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-[#A7B8AE] mt-1 leading-relaxed">{notif.description}</p>
                    <span className="text-[11px] font-mono text-[#71857A] mt-2 block">{notif.timestamp}</span>
                  </div>
                </div>

                <Badge variant={notif.category === 'Earnings' ? 'emerald' : 'gold'} size="sm">
                  {notif.category}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <Card className="p-10 text-center text-[#71857A]">
            <p className="text-sm font-sans">No notifications found in this view.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
