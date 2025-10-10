"use client";

import { ReactNode } from "react";
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

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-800/95 backdrop-blur-md border-b border-gold-500/20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
                <Image
                  src="/logos/emblem.png"
                  alt="Concierge Bank"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-serif text-xl font-bold hidden sm:block">
                Concierge<span className="text-gold-500">Bank</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-gold-500 text-dark-900"
                      : "text-gray-300 hover:bg-dark-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{user?.full_name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-400 hover:bg-dark-700 hover:text-gold-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-dark-700 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gold-500/20 bg-dark-800">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-gold-500 text-dark-900"
                      : "text-gray-300 hover:bg-dark-700"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
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
