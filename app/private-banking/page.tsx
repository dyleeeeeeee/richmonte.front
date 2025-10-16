import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Shield, 
  Crown, 
  Sparkles,
  Clock,
  Globe2,
  Award,
  ArrowRight,
  Phone,
  Lock,
  Gem
} from "lucide-react";

export const metadata: Metadata = {
  title: "Private Banking - Exclusive Financial Services for UHNW",
  description: "Concierge Bank's elite private banking for ultra-high net worth individuals. Personalized service, Swiss discretion, global access. Minimum $2M for exclusive membership.",
  alternates: {
    canonical: "https://conciergebank.us/private-banking",
  },
  openGraph: {
    title: "Private Banking | Concierge Bank",
    description: "Experience private banking redefined. Swiss precision, American excellence, Richemont heritage. For those who demand more.",
    url: "https://conciergebank.us/private-banking",
  },
};

export default function PrivateBankingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light-50 via-light-100 to-light-200">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-6">
              <Crown className="w-4 h-4 text-gold-600" />
              <span className="text-sm font-gruppo text-neutral-700">Ultra-High Net Worth Banking</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-work-sans font-bold text-neutral-900 mb-6">
              Private Banking <span className="text-gold-600">Redefined</span>
            </h1>
            <p className="text-xl text-neutral-600 font-gruppo max-w-3xl mx-auto leading-relaxed">
              Where Swiss discretion meets American opportunity. Exclusive financial services crafted for those who 
              expect nothing less than perfection—backed by the heritage of Richemont.
            </p>
          </div>

          {/* Elite Features Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="glass rounded-2xl p-6 text-center">
              <Shield className="w-10 h-10 text-gold-600 mx-auto mb-4" />
              <p className="text-sm font-work-sans font-semibold text-neutral-900 mb-1">Swiss Security</p>
              <p className="text-xs font-gruppo text-neutral-600">Bank-level discretion</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <Clock className="w-10 h-10 text-gold-600 mx-auto mb-4" />
              <p className="text-sm font-work-sans font-semibold text-neutral-900 mb-1">24/7 Concierge</p>
              <p className="text-xs font-gruppo text-neutral-600">Always available</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <Globe2 className="w-10 h-10 text-gold-600 mx-auto mb-4" />
              <p className="text-sm font-work-sans font-semibold text-neutral-900 mb-1">Global Access</p>
              <p className="text-xs font-gruppo text-neutral-600">Worldwide network</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <Gem className="w-10 h-10 text-gold-600 mx-auto mb-4" />
              <p className="text-sm font-work-sans font-semibold text-neutral-900 mb-1">Exclusive Events</p>
              <p className="text-xs font-gruppo text-neutral-600">Maison experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Concierge Experience */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-600/20 to-gold-800/20 z-10" />
              <Image
                src="/logos/emblem.png"
                alt="Concierge Bank Private Banking - Elite Financial Services"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-6">
                The Concierge <span className="text-gold-600">Experience</span>
              </h2>
              <p className="text-lg text-neutral-700 font-gruppo leading-relaxed mb-6">
                As a family-spirited subsidiary of Richemont—home to Cartier, Van Cleef & Arpels, IWC Schaffhausen, 
                and other legendary Maisons—we understand what true luxury means. It&apos;s not about ostentation; 
                it&apos;s about <strong>authenticity, craftsmanship, and enduring relationships</strong>.
              </p>
              <p className="text-lg text-neutral-700 font-gruppo leading-relaxed mb-8">
                Your private banking relationship with us is built on the same principles Richemont has upheld for 
                over three decades: <strong>patience, respect for heritage, and unwavering commitment to excellence</strong>.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-2">
                      Dedicated Relationship Manager
                    </h3>
                    <p className="text-neutral-700 font-gruppo">
                      Your personal banker knows your family, your goals, and your aspirations. One call. Always answered.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-2">
                      Uncompromising Discretion
                    </h3>
                    <p className="text-neutral-700 font-gruppo">
                      Swiss banking privacy standards applied with American innovation. Your financial affairs remain yours alone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Services */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-4">
              Exclusive <span className="text-gold-600">Services</span>
            </h2>
            <p className="text-lg text-neutral-600 font-gruppo max-w-3xl mx-auto">
              Services reserved for our most distinguished clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Bespoke Banking */}
            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-4">
                Bespoke Banking Solutions
              </h3>
              <ul className="space-y-3 text-neutral-700 font-gruppo">
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Customized credit facilities up to $10M</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Multi-currency accounts (USD, EUR, CHF, GBP)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Preferential foreign exchange rates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Priority wire transfers (expedited globally)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Offshore account structuring</span>
                </li>
              </ul>
            </div>

            {/* Investment Advisory */}
            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-4">
                Elite Investment Advisory
              </h3>
              <ul className="space-y-3 text-neutral-700 font-gruppo">
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Access to exclusive private placements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Pre-IPO investment opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Luxury collectibles portfolio (watches, art, wine)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Direct access to hedge fund managers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Real estate investment via Richemont network</span>
                </li>
              </ul>
            </div>

            {/* Concierge Services */}
            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-4">
                Lifestyle Concierge
              </h3>
              <ul className="space-y-3 text-neutral-700 font-gruppo">
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>24/7 global concierge hotline</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Private jet & yacht charter arrangements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Exclusive Cartier & Van Cleef experiences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Priority reservations at Michelin-star restaurants</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>VIP access to cultural events & fashion shows</span>
                </li>
              </ul>
            </div>

            {/* Family Office */}
            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center mb-6">
                <Globe2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-4">
                Family Office Services
              </h3>
              <ul className="space-y-3 text-neutral-700 font-gruppo">
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Multi-generational wealth planning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Estate & trust administration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Philanthropic foundation setup</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Next-gen financial education programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-3 mt-1">✓</span>
                  <span>Consolidated family reporting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Requirements */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-4">
              Membership <span className="text-gold-600">Requirements</span>
            </h2>
            <p className="text-lg text-neutral-600 font-gruppo">
              Private banking membership is by invitation or application with minimum qualifications.
            </p>
          </div>

          <div className="glass rounded-3xl p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-4">Minimum Criteria</h3>
                <ul className="space-y-4 text-neutral-700 font-gruppo">
                  <li className="flex items-start">
                    <span className="text-gold-600 mr-3 font-bold">•</span>
                    <span><strong>$2,000,000</strong> minimum relationship balance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-600 mr-3 font-bold">•</span>
                    <span><strong>$5,000,000+</strong> liquid net worth</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-600 mr-3 font-bold">•</span>
                    <span>Demonstrated high net worth status</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-600 mr-3 font-bold">•</span>
                    <span>Reference checks & background verification</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-4">Annual Fees</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gold-500/20">
                    <span className="text-neutral-700 font-gruppo">Private Banking</span>
                    <span className="font-work-sans font-bold text-gold-600">$2,500/year</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gold-500/20">
                    <span className="text-neutral-700 font-gruppo">Wealth Management</span>
                    <span className="font-work-sans font-bold text-gold-600">0.75% - 1.25%</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gold-500/20">
                    <span className="text-neutral-700 font-gruppo">Family Office</span>
                    <span className="font-work-sans font-bold text-gold-600">$10,000+/year</span>
                  </div>
                  <p className="text-sm text-neutral-600 font-gruppo mt-4">
                    *Fees may be waived for qualifying balances
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12">
            <Crown className="w-16 h-16 text-gold-600 mx-auto mb-6" />
            <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-6">
              Request <span className="text-gold-600">Private Banking Membership</span>
            </h2>
            <p className="text-lg text-neutral-600 font-gruppo mb-8 max-w-2xl mx-auto">
              Submit your application for consideration. Our private banking team will review your profile 
              and contact you within 48 hours for a confidential consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/register"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth shadow-lg shadow-gold-500/20 active:scale-95"
              >
                <span>Apply Now</span>
                <ArrowRight size={20} />
              </Link>
              <a
                href="tel:+18002664374"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 glass text-neutral-700 rounded-lg font-work-sans font-semibold hover:glass-gold transition-smooth shadow-md active:scale-95"
              >
                <Phone size={20} />
                <span>Call Private Banking</span>
              </a>
            </div>
            <p className="text-sm text-neutral-500 font-gruppo">
              Membership by application or invitation only • Subject to approval
            </p>
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
            "@type": "FinancialService",
            "name": "Private Banking Services",
            "description": "Exclusive private banking services for ultra-high net worth individuals with minimum $2M relationship balance",
            "provider": {
              "@type": "BankOrCreditUnion",
              "name": "Concierge Bank",
              "url": "https://conciergebank.us"
            },
            "serviceType": "Private Banking",
            "audience": {
              "@type": "Audience",
              "audienceType": "Ultra-High Net Worth Individuals"
            },
            "offers": {
              "@type": "Offer",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "price": "2000000",
                "priceCurrency": "USD",
                "description": "Minimum relationship balance"
              }
            }
          })
        }}
      />
    </div>
  );
}
