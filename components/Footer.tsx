"use client";

import Link from "next/link";
import Image from "next/image";
import TrustBadges from "./TrustBadges";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gradient-to-b from-light-100 to-light-200 border-t border-gold-300/30">
      <div className="container mx-auto px-6 py-16">
        {/* Trust Badges */}
        <div className="mb-12 pb-12 border-b border-gold-300/30">
          <h3 className="text-center text-sm font-medium text-neutral-600 mb-6">
            Regulatory Compliance & Trust
          </h3>
          <TrustBadges variant="compact" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/logos/emblem.png"
                  alt="Concierge Bank"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-display text-xl font-semibold text-neutral-900">
                Concierge<span className="text-gold-600">Bank</span>
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              a subsidiary of Compagnie Financière Richemont SA
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Swiss Precision. Maison Excellence.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gold-700">Services</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/#about" className="hover:text-gold-600 transition-colors">
                  Private Banking
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-gold-600 transition-colors">
                  Wealth Management
                </Link>
              </li>
              <li>
                <Link href="/#cards" className="hover:text-gold-600 transition-colors">
                  Elite Cards
                </Link>
              </li>
              <li>
                <Link href="/#concierge" className="hover:text-gold-600 transition-colors">
                  Concierge Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gold-700">Company</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/#about" className="hover:text-gold-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="https://www.richemont.com/en/home/about/careers/" target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-gold-600 transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gold-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gold-700">Contact</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>contact@conciergebank.com</li>
              <li>+41 22 123 4567</li>
              <li className="pt-4">
                <div className="flex space-x-4">
                  <a href="https://www.linkedin.com/company/richemont" target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors">
                    LinkedIn
                  </a>
                  <a href="https://twitter.com/RichemontGroup" target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors">
                    Twitter
                  </a>
                  <a href="https://www.instagram.com/richemontgroup" target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors">
                    Instagram
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold-300/30 text-center">
          <div className="text-xs text-neutral-500 mb-4 max-w-4xl mx-auto leading-relaxed">
            <p className="mb-2">
              Concierge Bank is a subsidiary of Compagnie Financière Richemont SA. Regulated by FINMA (Swiss Financial Market Supervisory Authority). 
              US operations covered by FDIC insurance up to applicable limits. Member of the Swiss Bankers Association.
            </p>
            <p className="text-[10px] text-neutral-400">
              Investment products and services are not FDIC insured, are not guaranteed by the bank, and may lose value. 
              Basel III compliant. PCI DSS Level 1 certified.
            </p>
          </div>
          <p className="text-sm text-neutral-500">&copy; {new Date().getFullYear()} Concierge Bank. A subsidiary of Compagnie Financière Richemont SA. All rights reserved.</p>
          <p className="text-xs mt-2 text-neutral-400">Geneva, Switzerland • Regulated Financial Institution</p>
        </div>
      </div>
    </footer>
  );
}
