"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-8"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-neutral-900">
            Concierge<span className="text-gold-600">Bank</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="#about"
            className="text-sm font-medium text-neutral-700 hover:text-gold-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="#cards"
            className="text-sm font-medium text-neutral-700 hover:text-gold-600 transition-colors"
          >
            Elite Cards
          </Link>
          <Link
            href="#concierge"
            className="text-sm font-medium text-neutral-700 hover:text-gold-600 transition-colors"
          >
            Concierge
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium text-neutral-700 hover:text-gold-600 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-neutral-700 hover:text-gold-600 transition-colors"
          >
            My Account
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-full font-semibold text-sm hover:from-gold-500 hover:to-gold-600 transition-colors shadow-md inline-block"
          >
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
