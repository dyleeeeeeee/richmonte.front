import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you're looking for doesn't exist. Return to Concierge Bank homepage for exclusive private banking services.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-50 via-light-100 to-light-200 px-4">
      <div className="text-center max-w-2xl">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center space-x-3 mb-8 group">
          <div className="relative w-16 h-16 transition-transform group-hover:scale-110">
            <Image
              src="/logos/emblem.png"
              alt="Concierge Bank Logo"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
          <span className="font-work-sans text-4xl font-extrabold">
            Concierge<span className="text-gold-500 group-hover:text-gold-400 transition-colors">Bank</span>
          </span>
        </Link>

        {/* Error Content */}
        <div className="glass rounded-3xl p-12 shadow-2xl mb-8">
          <h1 className="text-9xl font-work-sans font-bold text-gold-500 mb-4">404</h1>
          <h2 className="text-3xl font-work-sans font-bold text-neutral-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-neutral-600 font-gruppo mb-8 max-w-md mx-auto">
            The page you're seeking doesn't exist in our exclusive banking vault. 
            Let us guide you back to security.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth shadow-lg shadow-gold-500/20 active:scale-95"
            >
              <Home size={20} />
              <span>Return Home</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 glass text-neutral-700 rounded-lg font-work-sans font-semibold hover:glass-gold transition-smooth shadow-md active:scale-95"
            >
              <ArrowLeft size={20} />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* Popular Links */}
        <div className="text-sm text-neutral-600 font-gruppo">
          <p className="mb-4">Popular Destinations:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/private-banking" className="text-gold-600 hover:text-gold-500 hover:underline">
              Private Banking
            </Link>
            <Link href="/wealth-management" className="text-gold-600 hover:text-gold-500 hover:underline">
              Wealth Management
            </Link>
            <Link href="/cards" className="text-gold-600 hover:text-gold-500 hover:underline">
              Cards
            </Link>
            <Link href="/accounts" className="text-gold-600 hover:text-gold-500 hover:underline">
              Accounts
            </Link>
          </div>
        </div>

        {/* Structured Data for 404 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "404 Error - Page Not Found",
              "description": "This page does not exist",
              "url": "https://conciergebank.us/404",
              "isPartOf": {
                "@type": "WebSite",
                "name": "Concierge Bank",
                "url": "https://conciergebank.us"
              }
            })
          }}
        />
      </div>
    </div>
  );
}
