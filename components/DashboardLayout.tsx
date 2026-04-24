"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { notificationAPI, Notification } from "@/lib/api";
import SearchModal from "@/components/SearchModal";
import { dropdownVariants, slideInFromBottom, iconButtonVariants, badgeVariants } from "@/lib/animations";
import {
  Home,
  CreditCard,
  Send,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Wallet,
  Receipt,
  Bell,
  Search,
  ChevronDown,
  User,
  HelpCircle,
  Shield,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
  { name: "Accounts", href: "/dashboard/accounts", icon: <Wallet size={20} /> },
  { name: "Transfers", href: "/dashboard/transfers", icon: <Send size={20} /> },
  { name: "Cards", href: "/dashboard/cards", icon: <CreditCard size={20} /> },
  { name: "Trade", href: "/dashboard/trade", icon: <TrendingUp size={20} /> },
  { name: "Checks & Bills", href: "/dashboard/checks-and-bills", icon: <Receipt size={20} /> },
  { name: "Concierge", href: "/dashboard/concierge", icon: <MessageSquare size={20} /> },
  { name: "Settings", href: "/dashboard/settings", icon: <Settings size={20} /> },
  { name: "Admin", href: "/dashboard/admin", icon: <Shield size={20} />, adminOnly: true },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Load notifications from backend
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await notificationAPI.getNotifications();
        if (response.data) {
          setNotifications(response.data);
          const unreadCount = response.data.filter((n: Notification) => !n.read).length;
          setNotificationCount(unreadCount);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    };
    
    loadNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      // Escape to close search
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-light-50">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-light-50/90 backdrop-blur-xl border-b border-light-200/80">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 rounded-[28px] border border-light-200/80 bg-white/90 shadow-[0_10px_40px_rgba(23,34,58,0.08)] px-3 sm:px-4 lg:px-5 py-3">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 group shrink-0">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 shadow-[0_14px_30px_rgba(23,34,58,0.28)]">
                <svg viewBox="0 0 40 40" className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" aria-hidden>
                  <path d="M20 4 L36 32 L28 32 L20 18 L12 32 L4 32 Z" fill="#2C3E5A" />
                  <path d="M20 18 L28 32 L12 32 Z" fill="#354A68" />
                </svg>
                <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-work-sans text-xl lg:text-2xl font-extrabold text-navy-900 tracking-tight leading-none">
                  Inv<span className="text-navy-700">Bank</span>
                </span>
                <span className="text-[10px] font-work-sans font-semibold tracking-[0.18em] uppercase text-neutral-400 mt-1">
                  Wealth cockpit
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Futuristic Icon-First Style */}
            <div className="hidden md:flex items-center gap-1.5 rounded-2xl border border-light-200 bg-light-50/80 p-1.5 shadow-inner">
              {navItems.filter(item => !item.adminOnly || user?.role === 'admin').map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-2 rounded-2xl px-3 lg:px-4 py-2.5 text-sm font-work-sans font-semibold transition-all duration-300 group ${
                      isActive
                        ? "text-navy-950 bg-white shadow-sm"
                        : "text-neutral-500 hover:text-navy-700 hover:bg-white/80"
                    }`}
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white shadow-[0_12px_24px_rgba(23,34,58,0.18)]"
                        : "bg-light-100 text-neutral-500 group-hover:bg-navy-50 group-hover:text-navy-700"
                    }`}>
                        {item.icon}
                    </span>
                    {item.adminOnly && (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    )}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-1 h-1 rounded-full bg-gradient-to-r from-navy-700 via-navy-500 to-sky-400" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Section - Cleaner Icon-First Style */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search Button (Desktop) */}
              <button
                className="hidden lg:flex items-center gap-2 rounded-2xl border border-light-200 bg-light-50/80 px-3.5 py-2.5 text-neutral-500 hover:text-navy-700 hover:bg-white transition-all duration-300 group"
                onClick={() => setSearchModalOpen(true)}
                title="Search (⌘K)"
              >
                <Search size={18} className="transition-transform duration-300 group-hover:scale-110" />
                <span className="text-xs font-work-sans font-semibold">Search</span>
                <span className="rounded-lg bg-white px-2 py-1 text-[10px] text-neutral-400 border border-light-200">⌘K</span>
              </button>

              {/* Quick Search Icon (Tablet) */}
              <button
                className="lg:hidden h-11 w-11 flex items-center justify-center rounded-2xl border border-light-200 bg-light-50/80 text-neutral-500 hover:text-navy-700 hover:bg-white transition-all duration-300"
                onClick={() => setSearchModalOpen(true)}
                title="Search"
              >
                <Search size={20} className="transition-transform duration-300 hover:scale-110" />
              </button>

              {/* Notifications */}
              <button
                className="relative h-11 w-11 flex items-center justify-center rounded-2xl border border-light-200 bg-light-50/80 text-neutral-500 hover:text-navy-700 hover:bg-white transition-all duration-300 group"
                onClick={() => router.push('/dashboard/notifications')}
                title="Notifications"
              >
                <Bell size={20} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-navy-700 to-navy-900 text-[10px] font-bold text-white shadow-md">
                      {notificationCount}
                  </span>
                )}
              </button>

              {/* Help */}
              <button
                className="hidden sm:flex h-11 w-11 items-center justify-center rounded-2xl border border-light-200 bg-light-50/80 text-neutral-500 hover:text-navy-700 hover:bg-white transition-all duration-300"
                title="Help & Support"
              >
                <HelpCircle size={20} className="transition-transform duration-300 hover:scale-110" />
              </button>

              {/* User Profile Dropdown - Minimal Style */}
              <div ref={userMenuRef} className="hidden sm:block relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 rounded-2xl border border-light-200 bg-light-50/80 px-2.5 py-2 hover:bg-white transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform duration-300 group-hover:scale-105">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-work-sans font-semibold text-neutral-900 leading-tight">{user?.full_name}</p>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-400 font-work-sans font-bold mt-0.5">Private access</p>
                  </div>
                  <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu - Animated */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute right-0 mt-3 w-72 bg-white rounded-[24px] shadow-[0_20px_60px_rgba(23,34,58,0.18)] border border-light-200 overflow-hidden z-50"
                    >
                    <div className="p-4 border-b border-light-200 bg-gradient-to-br from-light-50 to-white">
                      <p className="text-[11px] font-work-sans font-bold tracking-[0.14em] uppercase text-neutral-400 mb-1">Signed in as</p>
                      <p className="text-sm font-work-sans font-bold text-neutral-900">{user?.full_name}</p>
                      <p className="text-xs text-neutral-500 truncate font-gruppo mt-0.5">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-light-50 hover:text-navy-900 transition-colors font-work-sans font-semibold"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings size={16} className="text-neutral-400" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-light-50 hover:text-navy-900 transition-colors font-work-sans font-semibold"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={16} className="text-neutral-400" />
                        <span>Profile</span>
                      </Link>
                    </div>
                    <div className="border-t border-light-200">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full font-work-sans font-semibold"
                      >
                        <LogOut size={16} className="text-red-400" />
                        <span>Logout</span>
                      </button>
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden h-11 w-11 flex items-center justify-center rounded-2xl border border-light-200 bg-light-50/80 text-neutral-500 hover:bg-white hover:text-navy-900 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Animated */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              variants={slideInFromBottom}
              initial="initial"
              animate="animate"
              exit="exit"
              className="md:hidden border-t border-light-200 bg-white/95 backdrop-blur-xl"
            >
            {/* Mobile User Info */}
            <div className="px-4 py-4 border-b border-light-200 bg-gradient-to-br from-light-50 to-white">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-work-sans font-bold text-neutral-900 truncate">{user?.full_name}</p>
                  <p className="text-xs text-neutral-600 truncate font-gruppo">{user?.email}</p>
                  <p className="text-xs text-navy-700 mt-0.5 font-gruppo">{user?.preferred_brand || 'Member'}</p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="px-4 py-4 grid grid-cols-2 gap-2">
              {navItems.filter(item => !item.adminOnly || user?.role === 'admin').map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-work-sans font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white shadow-md"
                        : "border border-light-200 bg-light-50 text-neutral-700 hover:bg-white hover:text-navy-900 active:scale-95"
                    }`}
                  >
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      isActive ? "bg-white/10 text-white" : "bg-white text-neutral-500"
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate">{item.name}</span>
                      {item.adminOnly && (
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Quick Actions */}
            <div className="px-4 py-3 border-t border-light-200 space-y-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/dashboard/notifications');
                }}
                className="flex items-center justify-between w-full px-4 py-3 rounded-2xl border border-light-200 bg-light-50 text-sm text-neutral-700 hover:bg-white hover:text-navy-900 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Bell size={18} />
                  <span>Notifications</span>
                </div>
                {notificationCount > 0 && (
                  <span className="px-2 py-0.5 bg-navy-700 text-white text-xs font-bold rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
              <button
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-2xl border border-light-200 bg-light-50 text-sm text-neutral-700 hover:bg-white hover:text-navy-900 transition-colors"
              >
                <HelpCircle size={18} />
                <span>Help & Support</span>
              </button>
            </div>

            {/* Mobile Logout */}
            <div className="px-4 py-3 border-t border-light-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-2xl border border-red-100 bg-red-50/60 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Main Content */}
      <main className="pt-28 pb-24 md:pb-8 bg-light-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) - Modernized */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 border-t border-light-200 safe-area-inset-bottom shadow-[0_-10px_40px_rgba(23,34,58,0.08)] backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-1 px-2 py-2.5 pb-safe">
          {navItems.filter(item => !item.adminOnly || user?.role === 'admin').slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl text-[10px] sm:text-xs font-medium transition-all active:scale-95 ${
                pathname === item.href
                  ? "text-navy-900 bg-light-50 border border-light-200"
                  : "text-neutral-600 hover:text-navy-900 active:bg-light-100"
              }`}
            >
              <div className={`mb-1 h-8 w-8 rounded-xl flex items-center justify-center ${pathname === item.href ? "bg-gradient-to-br from-navy-900 to-navy-700 text-white scale-110" : "bg-light-100 text-neutral-500"}`}>
                {item.icon}
              </div>
              <span className="leading-tight">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
