"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { X, Menu, ChevronRight, Phone } from "lucide-react";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Cards", href: "/#cards" },
  { label: "Private Banking", href: "/private-banking" },
  { label: "Wealth Management", href: "/wealth-management" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Top utility bar */}
      <div className="hidden md:block bg-neutral-900 text-neutral-300 text-xs py-2">
        <div className="container mx-auto px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5">
              <Phone size={11} className="text-gold-400" />
              <span>1-800-CONCIERGE&nbsp;&nbsp;|&nbsp;&nbsp;Mon–Fri 8am–8pm ET</span>
            </span>
            <span className="text-neutral-500">|</span>
            <span>FDIC Insured · FINMA Regulated · Basel III Compliant</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/security" className="hover:text-gold-400 transition-colors">Security Center</Link>
            <span className="text-neutral-600">|</span>
            <Link href="/login" className="hover:text-gold-400 transition-colors font-medium">Sign In</Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "top-0 bg-white/98 backdrop-blur-xl py-3 shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-neutral-100"
            : "top-0 md:top-[32px] bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
              <Image src="/logos/emblem.png" alt="Concierge Bank" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col leading-tight">
              <span className={`font-work-sans text-xl font-extrabold tracking-tight transition-colors duration-300 ${scrolled ? "text-neutral-900" : "text-neutral-900"}`}>
                Concierge<span className="text-gold-600">Bank</span>
              </span>
              <span className="text-[9px] tracking-[0.18em] uppercase text-gold-600 font-work-sans font-semibold hidden sm:block">
                A Richemont SA Company
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-work-sans font-semibold rounded-lg transition-all duration-200 hover:text-gold-600 hover:bg-gold-50 ${
                  pathname === link.href ? "text-gold-600" : "text-neutral-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-work-sans font-semibold text-neutral-700 hover:text-gold-700 border border-neutral-200 hover:border-gold-300 rounded-lg transition-all duration-200 hover:bg-gold-50"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-white text-sm font-work-sans font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-gold-500/20 flex items-center space-x-1.5"
            >
              <span>Open Account</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileOpen ? "visible" : "invisible"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
            <div className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image src="/logos/emblem.png" alt="Concierge Bank" fill className="object-contain" />
              </div>
              <span className="font-work-sans font-extrabold text-neutral-900">Concierge<span className="text-gold-600">Bank</span></span>
            </div>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-work-sans font-semibold text-neutral-700 hover:text-gold-700 hover:bg-gold-50 transition-all duration-200"
              >
                <span>{link.label}</span>
                <ChevronRight size={16} className="text-neutral-400" />
              </Link>
            ))}
          </div>

          <div className="px-4 py-6 border-t border-neutral-100 space-y-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-5 py-3 border border-neutral-200 rounded-xl text-sm font-work-sans font-semibold text-neutral-700 hover:border-gold-300 hover:text-gold-700 transition-all duration-200"
            >
              Sign In to My Account
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-5 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-xl text-sm font-work-sans font-bold shadow-lg shadow-gold-500/20 transition-all duration-200"
            >
              Open an Account
            </Link>
            <p className="text-center text-xs text-neutral-400 pt-1">
              <Phone size={10} className="inline mr-1" />
              1-800-CONCIERGE
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
