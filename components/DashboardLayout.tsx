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
  { name: "Bills", href: "/dashboard/bills", icon: <Receipt size={20} /> },
  { name: "Checks", href: "/dashboard/checks", icon: <FileText size={20} /> },
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b shadow-lg shadow-neutral-900/10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-3 group relative">
              <div className="relative w-10 h-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                <Image
                  src="/logos/emblem.png"
                  alt="Concierge Bank"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-work-sans text-xl font-extrabold transition-all duration-200 text-neutral-900">
                  Concierge<span className="text-gold-600 group-hover:text-gold-500">Bank</span>
                </span>
                <div className="h-0.5 w-0 bg-gradient-to-r from-gold-500 to-transparent group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.filter(item => !item.adminOnly || user?.role === 'admin').map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2.5 rounded-xl text-sm font-work-sans font-semibold transition-all duration-200 group ${
                      isActive
                        ? "bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/20"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      {item.icon}
                      <span>{item.name}</span>
                      {item.adminOnly && (
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </span>
                    {isActive && (
                      <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse"></div>
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-600/0 group-hover:from-gold-500/10 group-hover:to-gold-600/10 rounded-xl transition-all duration-200"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Section: Search, Notifications, User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Button (Desktop) */}
              <button
                className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-white/60 hover:bg-white border border-neutral-200/60 hover:border-gold-500/30 rounded-lg transition-all duration-200 group font-gruppo"
                onClick={() => setSearchModalOpen(true)}
                title="Search (⌘K)"
              >
                <Search size={16} className="text-neutral-500 group-hover:text-gold-500 transition-colors" />
                <span className="text-xs text-neutral-600 group-hover:text-neutral-700 font-gruppo">Search...</span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-neutral-100 border border-neutral-300 rounded text-neutral-600">⌘K</kbd>
              </button>

              {/* Quick Search Icon (Tablet) */}
              <button
                className="lg:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-gold-500 transition-all duration-200"
                onClick={() => setSearchModalOpen(true)}
                title="Search"
              >
                <Search size={20} />
              </button>

              {/* Notifications */}
              <button
                className="relative p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-gold-500 transition-all duration-200 group"
                onClick={() => router.push('/dashboard/notifications')}
                title="Notifications"
              >
                <Bell size={20} className="text-neutral-700 group-hover:text-neutral-900 group-hover:animate-wiggle" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 opacity-75"></span>
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-gold-500 text-[10px] font-bold text-white items-center justify-center">
                      {notificationCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Help */}
              <button
                className="hidden sm:block p-2.5 rounded-xl hover:bg-white/50 transition-all duration-200"
                title="Help & Support"
              >
                <HelpCircle size={20} className="text-neutral-700 hover:text-neutral-900" />
              </button>

              {/* User Profile Dropdown */}
              <div ref={userMenuRef} className="hidden sm:block relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/40 hover:bg-white/60 border border-neutral-200/60 hover:border-gold-500/30 transition-all duration-200 group backdrop-blur-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-work-sans font-bold text-neutral-900 leading-tight">{user?.full_name}</p>
                    <p className="text-xs text-neutral-600 leading-tight font-gruppo">{user?.preferred_brand || 'Member'}</p>
                  </div>
                  <ChevronDown size={16} className={`text-neutral-600 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu - Animated */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-2xl shadow-neutral-900/10 overflow-hidden z-50"
                    >
                    <div className="p-3 border-b border-neutral-200/60 bg-neutral-50/50">
                      <p className="text-sm font-work-sans font-bold text-neutral-900">{user?.full_name}</p>
                      <p className="text-xs text-neutral-600 truncate font-gruppo">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors font-work-sans font-medium"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors font-work-sans font-medium"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                    </div>
                    <div className="border-t border-neutral-200/60">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full font-work-sans font-medium"
                      >
                        <LogOut size={16} />
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
                className="md:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-all duration-200"
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
              className="md:hidden border-t border-neutral-200/60 glass"
            >
            {/* Mobile User Info */}
            <div className="px-4 py-4 border-b border-neutral-200/60 bg-neutral-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-work-sans font-bold text-neutral-900 truncate">{user?.full_name}</p>
                  <p className="text-xs text-neutral-600 truncate font-gruppo">{user?.email}</p>
                  <p className="text-xs text-gold-600 mt-0.5 font-gruppo">{user?.preferred_brand || 'Member'}</p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="px-4 py-4 space-y-1">
              {navItems.filter(item => !item.adminOnly || user?.role === 'admin').map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-work-sans font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-lg"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 active:scale-95"
                    }`}
                  >
                    <div className={`${isActive ? "" : "text-neutral-500"} flex items-center space-x-2`}>
                      {item.icon}
                      <span>{item.name}</span>
                      {item.adminOnly && (
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Quick Actions */}
            <div className="px-4 py-3 border-t border-neutral-200/60 space-y-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/dashboard/notifications');
                }}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Bell size={18} />
                  <span>Notifications</span>
                </div>
                {notificationCount > 0 && (
                  <span className="px-2 py-0.5 bg-gold-500 text-white text-xs font-bold rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
              <button
                className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                <HelpCircle size={18} />
                <span>Help & Support</span>
              </button>
            </div>

            {/* Mobile Logout */}
            <div className="px-4 py-3 border-t border-neutral-200/60">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
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
      <main className="pt-16 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) - Modernized */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-neutral-200/60 safe-area-inset-bottom shadow-lg">
        <div className="grid grid-cols-5 gap-0.5 px-1 py-2 pb-safe">
          {navItems.filter(item => !item.adminOnly || user?.role === 'admin').slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-[10px] sm:text-xs font-medium transition-all active:scale-95 ${
                pathname === item.href
                  ? "text-gold-600 bg-gold-500/10"
                  : "text-neutral-600 hover:text-neutral-900 active:bg-neutral-100"
              }`}
            >
              <div className={`mb-1 ${pathname === item.href ? "scale-110" : ""} flex items-center space-x-1`}>
                {item.icon}
                {item.adminOnly && (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
              <span className="leading-tight">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
