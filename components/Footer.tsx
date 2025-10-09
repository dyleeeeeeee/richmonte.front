"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gradient-to-b from-light-100 to-light-200 border-t border-gold-300/30">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-display text-xl font-bold text-neutral-900">
                Concierge<span className="text-gold-600">Bank</span>
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              Luxury Banking. Crafted by Motion.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gold-700">Services</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="#" className="hover:text-gold-600 transition-colors">
                  Private Banking
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold-600 transition-colors">
                  Wealth Management
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold-600 transition-colors">
                  Elite Cards
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold-600 transition-colors">
                  Concierge Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gold-700">Company</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="#" className="hover:text-gold-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold-600 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold-600 transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gold-700">Contact</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>contact@conciergebank.com</li>
              <li>+1 (555) 123-4567</li>
              <li className="pt-4">
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-gold-600 transition-colors">
                    LinkedIn
                  </a>
                  <a href="#" className="hover:text-gold-600 transition-colors">
                    Twitter
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold-300/30 text-center text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Concierge Bank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
