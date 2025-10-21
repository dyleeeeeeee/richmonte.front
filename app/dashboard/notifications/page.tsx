"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import AnimatedButton from "@/components/AnimatedButton";
import { notificationAPI, Notification } from "@/lib/api";
import { Bell, Check, Trash2, Mail, MailOpen, AlertCircle, Info, CheckCircle } from "lucide-react";
import { containerVariants, itemVariants, buttonVariants } from "@/lib/animations";

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

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageTransition>
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-work-sans font-bold mb-2 text-neutral-900">Notifications</h1>
              <p className="text-neutral-600 font-gruppo">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <AnimatedButton
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 glass rounded-xl hover:glass-gold transition-smooth font-work-sans font-semibold text-sm hover-lift shadow-md"
              >
                <MailOpen size={16} />
                <span>Mark All Read</span>
              </AnimatedButton>
            )}
          </div>

          {/* Filter Tabs - Animated */}
          <div className="flex space-x-2">
            <AnimatedButton
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-work-sans font-semibold text-sm transition-smooth ${
                filter === 'all'
                  ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/20'
                  : 'glass text-neutral-700 hover:glass-gold hover-lift'
              }`}
            >
              All ({notifications.length})
            </AnimatedButton>
            <AnimatedButton
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-xl font-work-sans font-semibold text-sm transition-smooth ${
                filter === 'unread'
                  ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/20'
                  : 'glass text-neutral-700 hover:glass-gold hover-lift'
              }`}
            >
              Unread ({unreadCount})
            </AnimatedButton>
          </div>

          {/* Notifications List - Staggered */}
          <motion.div 
            className="space-y-3"
            variants={containerVariants}
          >
            {filteredNotifications.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center shadow-lg animate-scale-in">
                <Bell className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-xl font-work-sans font-bold text-neutral-700 mb-2">No notifications</p>
                <p className="text-neutral-600 font-gruppo">You&apos;re all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <motion.div
                  variants={itemVariants}
                  key={notification.id}
                  className={`glass rounded-2xl p-6 transition-smooth hover:glass-gold hover-lift ${
                    !notification.read ? 'border-gold-500/40 shadow-gold-500/10' : 'shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-work-sans font-bold text-neutral-900 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-neutral-700 font-gruppo">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <span className="flex-shrink-0 ml-3 w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
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
                            className="text-xs text-gold-600 hover:text-gold-700 font-work-sans font-semibold flex items-center space-x-1 transition-smooth active:scale-95"
                          >
                            <Check size={12} />
                            <span>Mark as read</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
          </motion.div>
        </PageTransition>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
