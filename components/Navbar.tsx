"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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
        scrolled ? "bg-white/95 backdrop-blur-md py-5 shadow-sm" : "bg-transparent py-8"
      }`}
    >
      <div className="container mx-auto px-6 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-12 h-12 transition-transform group-hover:scale-105">
            <Image
              src="/logos/emblem.png"
              alt="Concierge Bank"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-display text-2xl md:text-3xl font-normal tracking-tight text-neutral-900">
            Concierge<span className="text-gold-600">Bank</span>
          </span>
        </Link>

        {isHomePage ? (
          <Link
            href="/login"
            className="text-base md:text-lg font-normal text-neutral-700 hover:text-gold-600 transition-all duration-300 hover:scale-105"
          >
            My Account
          </Link>
        ) : (
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/#about"
              className="text-sm font-medium text-neutral-700 hover:text-gold-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/#cards"
              className="text-sm font-medium text-neutral-700 hover:text-gold-600 transition-colors"
            >
              Elite Cards
            </Link>
            <Link
              href="/#concierge"
              className="text-sm font-medium text-neutral-700 hover:text-gold-600 transition-colors"
            >
              Concierge
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium text-neutral-700 hover:text-gold-600 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/login"
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
        )}
      </div>
    </nav>
  );
}
