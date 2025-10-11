"use client";

import { ReactNode, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
  { name: "Accounts", href: "/dashboard/accounts", icon: <Wallet size={20} /> },
  { name: "Transfers", href: "/dashboard/transfers", icon: <Send size={20} /> },
  { name: "Cards", href: "/dashboard/cards", icon: <CreditCard size={20} /> },
  { name: "Bills", href: "/dashboard/bills", icon: <Receipt size={20} /> },
  { name: "Checks", href: "/dashboard/checks", icon: <FileText size={20} /> },
  { name: "Settings", href: "/dashboard/settings", icon: <Settings size={20} /> },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationCount] = useState(3); // TODO: Connect to actual notifications
  const userMenuRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-dark-900">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-800/98 backdrop-blur-xl border-b border-gold-500/20 shadow-lg shadow-black/20">
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
                <span className="font-serif text-xl font-bold transition-all duration-200">
                  Concierge<span className="text-gold-500 group-hover:text-gold-400">Bank</span>
                </span>
                <div className="h-0.5 w-0 bg-gradient-to-r from-gold-500 to-transparent group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                      isActive
                        ? "bg-gradient-to-br from-gold-500 to-gold-600 text-dark-900 shadow-lg shadow-gold-500/20"
                        : "text-gray-300 hover:bg-dark-700/60 hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
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
                className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-dark-700/40 hover:bg-dark-700/60 border border-gold-500/10 hover:border-gold-500/30 rounded-lg transition-all duration-200 group"
                onClick={() => {/* TODO: Implement command palette */}}
                title="Search (⌘K)"
              >
                <Search size={16} className="text-gray-400 group-hover:text-gold-500 transition-colors" />
                <span className="text-xs text-gray-400 group-hover:text-gray-300">Search...</span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-dark-900 border border-gold-500/20 rounded text-gray-500">⌘K</kbd>
              </button>

              {/* Quick Search Icon (Tablet) */}
              <button
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-dark-700/60 hover:text-gold-500 transition-all duration-200"
                title="Search"
              >
                <Search size={20} />
              </button>

              {/* Notifications */}
              <button
                className="relative p-2 rounded-lg text-gray-400 hover:bg-dark-700/60 hover:text-gold-500 transition-all duration-200 group"
                onClick={() => router.push('/dashboard/notifications')}
                title="Notifications"
              >
                <Bell size={20} className="group-hover:animate-wiggle" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 opacity-75"></span>
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-gold-500 text-[10px] font-bold text-dark-900 items-center justify-center">
                      {notificationCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Help */}
              <button
                className="hidden sm:block p-2 rounded-lg text-gray-400 hover:bg-dark-700/60 hover:text-gold-500 transition-all duration-200"
                title="Help & Support"
              >
                <HelpCircle size={20} />
              </button>

              {/* User Profile Dropdown */}
              <div ref={userMenuRef} className="hidden sm:block relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-dark-700/40 hover:bg-dark-700/60 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-dark-900 font-bold text-sm shadow-lg">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-white leading-tight">{user?.full_name}</p>
                    <p className="text-xs text-gray-400 leading-tight">{user?.preferred_brand || 'Member'}</p>
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-dark-800 border border-gold-500/20 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50">
                    <div className="p-3 border-b border-gold-500/10 bg-dark-700/30">
                      <p className="text-sm font-semibold text-white">{user?.full_name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-700/60 hover:text-white transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-700/60 hover:text-white transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                    </div>
                    <div className="border-t border-gold-500/10">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-dark-700/60 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gold-500/20 bg-dark-800/95 backdrop-blur-lg animate-in slide-in-from-top duration-200">
            {/* Mobile User Info */}
            <div className="px-4 py-4 border-b border-gold-500/10 bg-dark-700/30">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-dark-900 font-bold text-lg shadow-lg">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  <p className="text-xs text-gold-500 mt-0.5">{user?.preferred_brand || 'Member'}</p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-br from-gold-500 to-gold-600 text-dark-900 shadow-lg"
                        : "text-gray-300 hover:bg-dark-700/60 hover:text-white active:scale-95"
                    }`}
                  >
                    <div className={isActive ? "" : "text-gray-400"}>{item.icon}</div>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Quick Actions */}
            <div className="px-4 py-3 border-t border-gold-500/10 space-y-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/dashboard/notifications');
                }}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-dark-700/60 hover:text-white transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Bell size={18} />
                  <span>Notifications</span>
                </div>
                {notificationCount > 0 && (
                  <span className="px-2 py-0.5 bg-gold-500 text-dark-900 text-xs font-bold rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
              <button
                className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-dark-700/60 hover:text-white transition-colors"
              >
                <HelpCircle size={18} />
                <span>Help & Support</span>
              </button>
            </div>

            {/* Mobile Logout */}
            <div className="px-4 py-3 border-t border-gold-500/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) - Modernized */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-dark-800/98 backdrop-blur-lg border-t border-gold-500/30 safe-area-inset-bottom">
        <div className="grid grid-cols-5 gap-0.5 px-1 py-2 pb-safe">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-[10px] sm:text-xs font-medium transition-all active:scale-95 ${
                pathname === item.href
                  ? "text-gold-500 bg-gold-500/10"
                  : "text-gray-400 hover:text-gray-300 active:bg-dark-700/50"
              }`}
            >
              <div className={`mb-1 ${pathname === item.href ? "scale-110" : ""}`}>
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
