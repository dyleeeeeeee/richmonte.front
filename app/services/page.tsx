import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  CreditCard, 
  Wallet, 
  ArrowRightLeft, 
  TrendingUp, 
  Shield, 
  Clock, 
  Sparkles,
  ArrowRight 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Banking Services - Private Banking & Wealth Management",
  description: "Discover Concierge Bank's comprehensive suite of private banking services: premium accounts, luxury cards, wealth management, and secure transfers. Swiss precision for American excellence.",
  alternates: {
    canonical: "https://conciergebank.us/services",
  },
  openGraph: {
    title: "Banking Services | Concierge Bank",
    description: "Premium banking services tailored for high net worth individuals. Experience Swiss precision banking in America.",
    url: "https://conciergebank.us/services",
  },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light-50 via-light-100 to-light-200">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <span className="text-sm font-gruppo text-neutral-700">Exceptional Banking Services</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-work-sans font-bold text-neutral-900 mb-6">
            Unparalleled <span className="text-gold-600">Banking Excellence</span>
          </h1>
          <p className="text-xl text-neutral-600 font-gruppo max-w-3xl mx-auto leading-relaxed">
            We deliver exceptional financial services with Swiss precision, creating memorable experiences 
            for today&apos;s sophisticated clients who are at the core of our approach.
          </p>
        </div>
      </section>

      {/* Core Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Premium Cards */}
            <Link href="/dashboard/cards" className="group">
              <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-gold-600 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all" />
                </div>
                <h3 className="text-3xl font-work-sans font-bold text-neutral-900 mb-4">
                  Luxury Concierge Cards
                </h3>
                <p className="text-neutral-700 font-gruppo leading-relaxed mb-6">
                  Experience our exclusive card collection, inspired by Richemont&apos;s finest Maisons. From the 
                  elegant Gold Card to the prestigious Platinum and the ultra-exclusive Black Card—each crafted 
                  with Swiss precision and American style.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-gold-600 mt-0.5" />
                    <span className="text-neutral-700 font-gruppo">Credit limits up to $500,000</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-gold-600 mt-0.5" />
                    <span className="text-neutral-700 font-gruppo">Luxury rewards & concierge services</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gold-600 mt-0.5" />
                    <span className="text-neutral-700 font-gruppo">24/7 premium support</span>
                  </li>
                </ul>
                <div className="inline-flex items-center text-gold-600 font-work-sans font-semibold group-hover:text-gold-700">
                  Explore Cards →
                </div>
              </div>
            </Link>

            {/* Premium Accounts */}
            <Link href="/dashboard/accounts" className="group">
              <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-gold-600 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all" />
                </div>
                <h3 className="text-3xl font-work-sans font-bold text-neutral-900 mb-4">
                  Private Banking Accounts
                </h3>
                <p className="text-neutral-700 font-gruppo leading-relaxed mb-6">
                  Our bespoke account offerings provide the foundation for your wealth management strategy. 
                  From high-yield checking to exclusive investment accounts—each designed with your unique 
                  financial goals in mind.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-gold-600 mt-0.5" />
                    <span className="text-neutral-700 font-gruppo">FDIC insured up to $250,000</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-gold-600 mt-0.5" />
                    <span className="text-neutral-700 font-gruppo">Competitive interest rates</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gold-600 mt-0.5" />
                    <span className="text-neutral-700 font-gruppo">No monthly maintenance fees</span>
                  </li>
                </ul>
                <div className="inline-flex items-center text-gold-600 font-work-sans font-semibold group-hover:text-gold-700">
                  View Accounts →
                </div>
              </div>
            </Link>

            {/* Transfers & Payments */}
            <Link href="/dashboard/transfers" className="group">
              <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center">
                    <ArrowRightLeft className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-gold-600 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all" />
                </div>
                <h3 className="text-3xl font-work-sans font-bold text-neutral-900 mb-4">
                  Secure Transfers
                </h3>
                <p className="text-neutral-700 font-gruppo leading-relaxed mb-6">
                  Move your wealth with confidence. Our secure transfer system supports internal transfers, 
                  external wire transfers, and person-to-person payments—all with Swiss-level security and 
                  American convenience.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-gold-600 mt-0.5" />
                    <span className="text-neutral-700 font-gruppo">Bank-grade encryption</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gold-600 mt-0.5" />
                    <span className="text-neutral-700 font-gruppo">Same-day transfers available</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-gold-600 mt-0.5" />
                    <span className="text-neutral-700 font-gruppo">International wire transfers</span>
                  </li>
                </ul>
                <div className="inline-flex items-center text-gold-600 font-work-sans font-semibold group-hover:text-gold-700">
                  Start Transfer →
                </div>
              </div>
            </Link>

            {/* Wealth Management */}
            <Link href="/wealth-management" className="group">
              <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-gold-600 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all" />
                </div>
                <h3 className="text-3xl font-work-sans font-bold text-neutral-900 mb-4">
                  Wealth Management
                </h3>
                <p className="text-neutral-700 font-gruppo leading-relaxed mb-6">
                  Leverage Richemont&apos;s global expertise to grow and protect your wealth. Our dedicated wealth 
                  advisors create bespoke portfolios that align with your values, risk tolerance, and long-term 
                  vision.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-gold-600 mt-0.5" />
                    <span className="text-neutral-700 font-gruppo">Personalized investment strategies</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-gold-600 mt-0.5" />
                    <span className="text-neutral-700 font-gruppo">Global market access</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gold-600 mt-0.5" />
                    <span className="text-neutral-700 font-gruppo">Dedicated wealth advisor</span>
                  </li>
                </ul>
                <div className="inline-flex items-center text-gold-600 font-work-sans font-semibold group-hover:text-gold-700">
                  Learn More →
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-4">
              Why Concierge <span className="text-gold-600">Bank</span>
            </h2>
            <p className="text-lg text-neutral-600 font-gruppo max-w-2xl mx-auto">
              We set unparalleled standards of service, creating memorable experiences backed by 
              Richemont&apos;s commitment to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-600 to-gold-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-3">Swiss Security</h3>
              <p className="text-neutral-700 font-gruppo">
                Bank-grade encryption, two-factor authentication, and discretion that Swiss banking is famous for.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-600 to-gold-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-3">Personalized Service</h3>
              <p className="text-neutral-700 font-gruppo">
                Dedicated relationship managers who understand your unique financial goals and aspirations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-600 to-gold-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-3">24/7 Excellence</h3>
              <p className="text-neutral-700 font-gruppo">
                Round-the-clock support from our concierge banking team, whenever and wherever you need us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12">
            <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-6">
              Ready to Experience <span className="text-gold-600">Excellence</span>?
            </h2>
            <p className="text-lg text-neutral-600 font-gruppo mb-8 max-w-2xl mx-auto">
              Join the distinguished circle of Concierge Bank members and discover what Swiss precision 
              banking feels like in America.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth shadow-lg shadow-gold-500/20 active:scale-95"
              >
                <span>Request Membership</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/private-banking"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 glass text-neutral-700 rounded-lg font-work-sans font-semibold hover:glass-gold transition-smooth shadow-md active:scale-95"
              >
                <span>Private Banking</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Private Banking Services",
            "provider": {
              "@type": "BankOrCreditUnion",
              "name": "Concierge Bank",
              "url": "https://conciergebank.us"
            },
            "areaServed": {
              "@type": "Country",
              "name": "United States"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Banking Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "BankAccount",
                    "name": "Private Banking Accounts"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "PaymentCard",
                    "name": "Luxury Concierge Cards"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "FinancialProduct",
                    "name": "Wealth Management"
                  }
                }
              ]
            }
          })
        }}
      />
    </div>
  );
}
