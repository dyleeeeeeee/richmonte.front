"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, Menu, ChevronRight, Phone } from "lucide-react";

const navLinks = [
  { label: "Credit Cards", href: "/#cards" },
  { label: "Accounts", href: "/#accounts" },
  { label: "Lending", href: "/#lending" },
  { label: "Business", href: "/#business" },
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
      {/* FDIC banner bar — warm stone, matches Apex reference top strip */}
      <div className="hidden md:block bg-stone-200 text-stone-600 text-[11px] font-semibold tracking-wide py-1.5 text-center border-b border-stone-300">
        FDIC-Insured — Backed by the full faith and credit of the U.S. Government
      </div>
      <div className="hidden md:block bg-navy-950 text-navy-100 text-xs py-2">
        <div className="container mx-auto px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5">
              <Phone size={11} className="text-navy-300" />
              <span>1-800-INVBANK&nbsp;&nbsp;|&nbsp;&nbsp;Mon–Fri 8am–8pm ET</span>
            </span>
            <span className="text-neutral-500">|</span>
            <span>FDIC Insured · Equal Housing Lender</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/security" className="hover:text-navy-300 transition-colors">Security Center</Link>
            <span className="text-neutral-600">|</span>
            <Link href="/login" className="hover:text-navy-300 transition-colors font-medium">Sign In</Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "top-0 bg-white/98 backdrop-blur-xl py-3 shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-neutral-100"
            : "top-0 md:top-[56px] bg-white py-4 border-b border-neutral-100"
        }`}
      >
        <div className="container mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            {/* Geometric navy logomark (pyramid/peak) */}
            <svg viewBox="0 0 40 40" className="w-9 h-9 transition-transform group-hover:scale-105" aria-hidden>
              <path d="M20 4 L36 32 L28 32 L20 18 L12 32 L4 32 Z" fill="#2C3E5A" />
              <path d="M20 18 L28 32 L12 32 Z" fill="#354A68" />
            </svg>
            <div className="flex flex-col leading-tight">
              <span className={`font-work-sans text-xl font-extrabold tracking-tight text-neutral-900`}>
                Inv<span className="text-navy-700">Bank</span>
              </span>
              <span className="text-[9px] tracking-[0.18em] uppercase text-navy-600 font-work-sans font-semibold hidden sm:block">
                FDIC-Insured · Member FDIC
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-work-sans font-semibold rounded-lg transition-all duration-200 hover:text-navy-700 hover:bg-navy-50 ${
                  pathname === link.href ? "text-navy-700" : "text-neutral-700"
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
              className="px-6 py-2 bg-navy-700 hover:bg-navy-800 text-white text-sm font-work-sans font-bold rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign In
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
              <svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden>
                <path d="M20 4 L36 32 L28 32 L20 18 L12 32 L4 32 Z" fill="#2C3E5A" />
                <path d="M20 18 L28 32 L12 32 Z" fill="#354A68" />
              </svg>
              <span className="font-work-sans font-extrabold text-neutral-900">Inv<span className="text-navy-700">Bank</span></span>
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
                className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-work-sans font-semibold text-neutral-700 hover:text-navy-700 hover:bg-navy-50 transition-all duration-200"
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
              className="block w-full text-center px-5 py-3 bg-navy-700 text-white rounded-xl text-sm font-work-sans font-bold shadow-md transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-5 py-3 border border-navy-300 text-navy-700 rounded-xl text-sm font-work-sans font-bold transition-all duration-200"
            >
              Open an Account
            </Link>
            <p className="text-center text-xs text-neutral-400 pt-1">
              <Phone size={10} className="inline mr-1" />
              1-800-INVBANK
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
