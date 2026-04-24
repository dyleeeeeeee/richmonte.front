"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { notificationAPI, Notification } from "@/lib/api";
import { Bell, Check, MailOpen, AlertCircle, Info, CheckCircle } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      if (response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
      case 'registration':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  function BentoTile({ children, className = "", onClick }: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={onClick}
        className={`relative rounded-2xl border border-light-300/80 bg-white text-neutral-900 shadow-sm p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-navy-700/40 ${onClick ? "cursor-pointer" : ""} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-navy-700 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
          <div className="space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-work-sans font-bold tracking-[0.12em] uppercase text-neutral-500">
                Inbox
              </p>
              <h1 className="text-2xl sm:text-3xl font-work-sans font-bold text-neutral-900 mt-1">Notifications</h1>
              <p className="text-sm text-neutral-500 font-gruppo mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2.5 bg-navy-700 hover:bg-navy-800 text-white rounded-xl font-work-sans font-semibold text-sm transition-colors"
              >
                <MailOpen size={16} />
                <span>Mark All Read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <BentoTile className="p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2.5 rounded-xl font-work-sans font-semibold text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-navy-700 text-white'
                  : 'bg-light-100 text-neutral-700 hover:bg-light-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2.5 rounded-xl font-work-sans font-semibold text-sm transition-colors ${
                filter === 'unread'
                  ? 'bg-navy-700 text-white'
                  : 'bg-light-100 text-neutral-700 hover:bg-light-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
          </BentoTile>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <BentoTile className="p-12 text-center">
                <div className="w-16 h-16 bg-light-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-xl font-work-sans font-bold text-neutral-900 mb-2">No notifications</p>
                <p className="text-neutral-500 font-gruppo">You&apos;re all caught up!</p>
              </BentoTile>
            ) : (
              filteredNotifications.map((notification) => (
                <BentoTile
                  key={notification.id}
                  className={!notification.read ? "border-navy-200 bg-navy-50/30" : ""}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-light-100 flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-work-sans font-semibold text-neutral-900 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-neutral-600 font-gruppo text-sm">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <span className="flex-shrink-0 ml-3 w-2 h-2 rounded-full bg-navy-700 animate-pulse"></span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-3">
                        <span className="text-xs text-neutral-500 font-gruppo">
                          {new Date(notification.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-navy-700 hover:text-navy-900 font-work-sans font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Check size={12} />
                            <span>Mark as read</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </BentoTile>
              ))
            )}
          </div>
          </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
