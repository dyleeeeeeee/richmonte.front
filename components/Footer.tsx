"use client";

import Link from "next/link";
import Image from "next/image";
import TrustBadges from "./TrustBadges";
import BranchMap from "./BranchMap";
import { Phone, Mail, MapPin } from "lucide-react";

const footerLinks = {
  products: {
    title: "Products",
    links: [
      { label: "Checking Accounts", href: "/dashboard" },
      { label: "Savings Accounts", href: "/dashboard" },
      { label: "Elite Credit Cards", href: "/#cards" },
      { label: "Investment Accounts", href: "/wealth-management" },
      { label: "International Wires", href: "/dashboard" },
      { label: "Check Services", href: "/dashboard" },
    ],
  },
  services: {
    title: "Private Banking",
    links: [
      { label: "Private Wealth Management", href: "/wealth-management" },
      { label: "Portfolio Advisory", href: "/wealth-management" },
      { label: "Estate & Succession", href: "/private-banking" },
      { label: "Maison Concierge", href: "/private-banking" },
      { label: "Fine Art Advisory", href: "/private-banking" },
      { label: "Family Office Services", href: "/private-banking" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Security Center", href: "/security" },
      { label: "Careers", href: "https://www.richemont.com/en/home/about/careers/", external: true },
      { label: "Newsroom", href: "/about" },
      { label: "Accessibility", href: "/about" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/privacy" },
      { label: "FDIC Notice", href: "/security" },
      { label: "Regulatory Disclosures", href: "/security" },
      { label: "ADA / WCAG Compliance", href: "/about" },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="relative z-10 bg-neutral-950 text-neutral-400">

      {/* Trust bar */}
      <div className="border-b border-white/5 py-10">
        <div className="container mx-auto px-6 sm:px-8">
          <p className="text-center text-xs font-work-sans font-semibold tracking-widest uppercase text-neutral-500 mb-7">
            Regulatory Compliance &amp; Security Standards
          </p>
          <TrustBadges variant="compact" className="[&_p]:text-neutral-500 [&_p.text-xs]:text-neutral-600 [&_div.w-12]:bg-white/5" />
        </div>
      </div>

      {/* Main columns */}
      <div className="container mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-9 h-9">
                <Image src="/logos/emblem.png" alt="Concierge Bank" fill className="object-contain" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-work-sans text-lg font-extrabold text-white">
                  Concierge<span className="text-gold-500">Bank</span>
                </span>
                <span className="text-[9px] tracking-[0.15em] uppercase text-gold-600 font-work-sans font-semibold">
                  A Richemont SA Company
                </span>
              </div>
            </Link>

            <p className="text-sm font-gruppo leading-relaxed text-neutral-400 max-w-xs">
              America&apos;s premier private bank — built on Swiss precision, Maison heritage, and an uncompromising commitment to client discretion.
            </p>

            <div className="space-y-2.5 pt-2">
              <a href="tel:+18002662434" className="flex items-center space-x-2.5 text-sm text-neutral-400 hover:text-gold-400 transition-colors group">
                <Phone size={14} className="text-gold-600 flex-shrink-0" />
                <span className="font-gruppo">1-800-CONCIERGE (Mon–Fri 8am–8pm ET)</span>
              </a>
              <a href="mailto:contact@conciergebank.us" className="flex items-center space-x-2.5 text-sm text-neutral-400 hover:text-gold-400 transition-colors">
                <Mail size={14} className="text-gold-600 flex-shrink-0" />
                <span className="font-gruppo">contact@conciergebank.us</span>
              </a>
              <div className="flex items-start space-x-2.5 text-sm text-neutral-500">
                <MapPin size={14} className="text-gold-600 flex-shrink-0 mt-0.5" />
                <span className="font-gruppo">One Financial Plaza, Wall Street District<br />New York, NY 10005</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center space-x-3 pt-2">
              {[
                { label: "LinkedIn", href: "https://www.linkedin.com/company/richemont" },
                { label: "X", href: "https://twitter.com/RichemontGroup" },
                { label: "Instagram", href: "https://www.instagram.com/richemontgroup" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold-500/30 rounded-lg text-xs font-work-sans font-semibold text-neutral-400 hover:text-gold-400 transition-all duration-200"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.values(footerLinks).map((col) => (
            <div key={col.title} className="lg:col-span-1">
              <h4 className="text-xs font-work-sans font-bold tracking-widest uppercase text-neutral-200 mb-5">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-gruppo text-neutral-400 hover:text-gold-400 transition-colors duration-150"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm font-gruppo text-neutral-400 hover:text-gold-400 transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Branch map */}
      <div className="border-t border-white/5 py-12">
        <div className="container mx-auto px-6 sm:px-8">
          <h3 className="text-center text-sm font-work-sans font-bold tracking-widest uppercase text-neutral-500 mb-8">
            Global Locations
          </h3>
          <BranchMap />
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-white/5 py-8">
        <div className="container mx-auto px-6 sm:px-8 space-y-4">
          <p className="text-[11px] font-gruppo text-neutral-600 leading-relaxed max-w-5xl mx-auto text-center">
            Concierge Bank is a subsidiary of Compagnie Financière Richemont SA. Member FDIC. Deposit accounts are FDIC-insured up to $250,000 per depositor, per insured bank, for each account ownership category. US operations are additionally regulated by FINMA (Swiss Financial Market Supervisory Authority) and comply with Basel III international banking standards. PCI DSS Level 1 certified.
          </p>
          <p className="text-[10px] font-gruppo text-neutral-700 leading-relaxed max-w-5xl mx-auto text-center">
            Investment products and securities offered through Concierge Bank Wealth Management are <strong className="text-neutral-600">NOT FDIC insured</strong>, are not deposits or obligations of Concierge Bank, are not guaranteed by the bank, and <strong className="text-neutral-600">may lose value</strong>. Variable APR on credit products is based on creditworthiness and the Prime Rate as published in The Wall Street Journal. Subject to credit approval.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
            <p className="text-xs text-neutral-600 font-gruppo">
              &copy; {new Date().getFullYear()} Concierge Bank. A subsidiary of Compagnie Financière Richemont SA. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-xs text-neutral-600 font-gruppo">
              <Link href="/privacy" className="hover:text-neutral-400 transition-colors">Privacy</Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-neutral-400 transition-colors">Terms</Link>
              <span>·</span>
              <Link href="/security" className="hover:text-neutral-400 transition-colors">Security</Link>
              <span>·</span>
              <Link href="/sitemap.xml" className="hover:text-neutral-400 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
