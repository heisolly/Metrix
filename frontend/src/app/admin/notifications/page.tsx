"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  DollarSign,
  Trophy,
  AlertCircle,
  Users,
  Eye,
  X,
  Filter
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_notifications'
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('admin_notifications')
        .select(`
          *,
          user:profiles(username, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter === 'unread') {
        query = query.eq('is_read', false);
      } else if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setNotifications(data || []);
      
      // Count unread
      const { count } = await supabase
        .from('admin_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('admin_notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from('admin_notifications')
        .update({ is_read: true })
        .eq('is_read', false);
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment_success':
      case 'payment_request':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'payment_declined':
      case 'payment_cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      case 'tournament_joined':
      case 'tournament_created':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'dispute_filed':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'spectator_application':
        return <Eye className="w-5 h-5 text-purple-500" />;
      case 'user_registered':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'withdrawal_request':
        return <DollarSign className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'payment_success':
        return 'border-green-500/30 bg-green-500/5';
      case 'payment_declined':
      case 'payment_cancelled':
        return 'border-red-500/30 bg-red-500/5';
      case 'tournament_joined':
      case 'tournament_created':
        return 'border-yellow-500/30 bg-yellow-500/5';
      case 'dispute_filed':
        return 'border-orange-500/30 bg-orange-500/5';
      case 'spectator_application':
        return 'border-purple-500/30 bg-purple-500/5';
      case 'user_registered':
        return 'border-blue-500/30 bg-blue-500/5';
      case 'withdrawal_request':
        return 'border-yellow-500/30 bg-yellow-500/5';
      default:
        return 'border-white/10 bg-white/5';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            NOTIFICATIONS
          </h1>
          <p className="text-white/70">
            Stay updated on all platform activities
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-red-500 rounded-full">
            <span className="text-white font-bold">{unreadCount} Unread</span>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: 'Unread' },
          { key: 'payment_success', label: 'Payments' },
          { key: 'tournament_joined', label: 'Tournaments' },
          { key: 'withdrawal_request', label: 'Withdrawals' },
          { key: 'dispute_filed', label: 'Disputes' },
          { key: 'user_registered', label: 'New Users' },
          { key: 'spectator_application', label: 'Spectators' }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all {
              filter === f.key
                ? 'bg-red-500 text-white'
                : 'bg-slate-900 text-white/50 hover:text-white border border-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
          />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-4 rounded-2xl border ${getNotificationColor(notification.type)} {
                !notification.is_read ? 'border-l-4' : ''
              } hover:bg-white/10 transition-all group`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-white">{notification.title}</h3>
                    <span className="text-xs text-white/50 whitespace-nowrap">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-2">{notification.message}</p>
                  
                  {notification.user && (
                    <div className="text-xs text-white/50">
                      User: {notification.user.username || notification.user.email}
                    </div>
                  )}
                </div>

                {/* Mark as Read Button */}
                {!notification.is_read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Mark Read
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900 border border-white/10 rounded-2xl border-dashed">
          <Bell className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Notifications</h3>
          <p className="text-white/50">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
