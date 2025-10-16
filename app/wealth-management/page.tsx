import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  TrendingUp, 
  Shield, 
  Globe2, 
  Sparkles,
  BarChart3,
  PieChart,
  Target,
  ArrowRight,
  Award,
  Users
} from "lucide-react";

export const metadata: Metadata = {
  title: "Wealth Management - Personalized Investment Strategies",
  description: "Concierge Bank's bespoke wealth management services for high net worth individuals. Global market access, personalized portfolios, and dedicated advisors. Swiss precision, American opportunity.",
  alternates: {
    canonical: "https://conciergebank.us/wealth-management",
  },
  openGraph: {
    title: "Wealth Management | Concierge Bank",
    description: "Grow and protect your wealth with Swiss precision. Personalized investment strategies backed by Richemont's global expertise.",
    url: "https://conciergebank.us/wealth-management",
  },
};

export default function WealthManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light-50 via-light-100 to-light-200">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span className="text-sm font-gruppo text-neutral-700">Richemont Global Expertise</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-work-sans font-bold text-neutral-900 mb-6">
                Wealth That <span className="text-gold-600">Endures</span>
              </h1>
              <p className="text-xl text-neutral-600 font-gruppo leading-relaxed mb-8">
                We craft bespoke investment portfolios with the same meticulous attention to detail that Richemont 
                applies to its finest Maisons. Your wealth, nurtured with Swiss precision for generations to come.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth shadow-lg shadow-gold-500/20 active:scale-95"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="#services"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 glass text-neutral-700 rounded-lg font-work-sans font-semibold hover:glass-gold transition-smooth shadow-md active:scale-95"
                >
                  <span>Learn More</span>
                </Link>
              </div>
            </div>
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-600/10 to-gold-800/10 z-10" />
              <Image
                src="/logos/emblem.png"
                alt="Concierge Bank Wealth Management - Swiss Precision Investment Strategy"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-4">
              Our <span className="text-gold-600">Philosophy</span>
            </h2>
            <p className="text-lg text-neutral-600 font-gruppo max-w-3xl mx-auto">
              Like a master watchmaker crafting a timepiece, we construct portfolios with precision, patience, and 
              respect for the long-term. Every investment decision is deliberate, every strategy bespoke.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="glass rounded-3xl p-8">
              <Target className="w-12 h-12 text-gold-600 mb-6" />
              <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-4">
                Tailored to You
              </h3>
              <p className="text-neutral-700 font-gruppo leading-relaxed">
                No two clients are alike. We begin by understanding your values, aspirations, and risk tolerance. 
                Whether you're preserving generational wealth or building it for the first time, your portfolio 
                reflects your unique financial DNA.
              </p>
            </div>

            <div className="glass rounded-3xl p-8">
              <Globe2 className="w-12 h-12 text-gold-600 mb-6" />
              <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-4">
                Global Perspective
              </h3>
              <p className="text-neutral-700 font-gruppo leading-relaxed">
                Through Richemont's global network spanning Geneva, New York, Hong Kong, and beyond, we access 
                opportunities across continents. Your wealth isn't confined by borders—neither is our expertise.
              </p>
            </div>

            <div className="glass rounded-3xl p-8">
              <Shield className="w-12 h-12 text-gold-600 mb-6" />
              <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-4">
                Risk Management
              </h3>
              <p className="text-neutral-700 font-gruppo leading-relaxed">
                Swiss banking means protecting what matters. We employ sophisticated risk mitigation strategies, 
                diversification across asset classes, and constant vigilance to safeguard your wealth through 
                market cycles.
              </p>
            </div>

            <div className="glass rounded-3xl p-8">
              <TrendingUp className="w-12 h-12 text-gold-600 mb-6" />
              <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-4">
                Sustainable Growth
              </h3>
              <p className="text-neutral-700 font-gruppo leading-relaxed">
                We take a long-term view, just as Richemont has nurtured its Maisons for over a century. Quick 
                gains fade—enduring wealth is built thoughtfully, patiently, and with unwavering discipline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Solutions */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-4">
              Investment <span className="text-gold-600">Solutions</span>
            </h2>
            <p className="text-lg text-neutral-600 font-gruppo max-w-3xl mx-auto">
              Comprehensive wealth management services designed for sophisticated investors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Portfolio Management */}
            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center mb-6">
                <PieChart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-4">
                Portfolio Management
              </h3>
              <ul className="space-y-3 text-neutral-700 font-gruppo">
                <li className="flex items-start">
                  <span className="text-gold-600 mr-2">•</span>
                  <span>Discretionary & advisory mandates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-2">•</span>
                  <span>Multi-asset allocation strategies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-2">•</span>
                  <span>Quarterly performance reviews</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-2">•</span>
                  <span>Tax-efficient structures</span>
                </li>
              </ul>
            </div>

            {/* Alternative Investments */}
            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-4">
                Alternative Investments
              </h3>
              <ul className="space-y-3 text-neutral-700 font-gruppo">
                <li className="flex items-start">
                  <span className="text-gold-600 mr-2">•</span>
                  <span>Private equity & venture capital</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-2">•</span>
                  <span>Luxury collectibles (watches, art)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-2">•</span>
                  <span>Real estate opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-2">•</span>
                  <span>Hedge fund access</span>
                </li>
              </ul>
            </div>

            {/* Wealth Planning */}
            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-4">
                Wealth Planning
              </h3>
              <ul className="space-y-3 text-neutral-700 font-gruppo">
                <li className="flex items-start">
                  <span className="text-gold-600 mr-2">•</span>
                  <span>Estate & succession planning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-2">•</span>
                  <span>Philanthropic strategies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-2">•</span>
                  <span>Tax optimization consulting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-600 mr-2">•</span>
                  <span>Family office services</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Concierge Difference */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-6">
                The Concierge <span className="text-gold-600">Difference</span>
              </h2>
              <p className="text-lg text-neutral-700 font-gruppo leading-relaxed mb-6">
                What sets us apart isn't just our Richemont heritage—it's how we apply those values to your wealth.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-2">
                      Dedicated Advisor Team
                    </h3>
                    <p className="text-neutral-700 font-gruppo">
                      Your personal wealth advisor, backed by specialists in tax, estate planning, and alternative investments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-2">
                      Fiduciary Standard
                    </h3>
                    <p className="text-neutral-700 font-gruppo">
                      We're legally obligated to act in your best interest—always. No conflicts, no commissions, just aligned incentives.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-2">
                      Exclusive Opportunities
                    </h3>
                    <p className="text-neutral-700 font-gruppo">
                      Access to pre-IPO investments, private placements, and luxury collectibles through Richemont's network.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass rounded-3xl p-8">
              <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-6">
                Minimum Investment
              </h3>
              <div className="mb-8">
                <p className="text-5xl font-work-sans font-bold text-gold-600 mb-2">$500K</p>
                <p className="text-neutral-600 font-gruppo">
                  Assets under management minimum for personalized wealth management services
                </p>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-700 font-gruppo">Advisory Fee</span>
                  <span className="font-work-sans font-semibold text-neutral-900">0.75% - 1.25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-700 font-gruppo">Performance Fee</span>
                  <span className="font-work-sans font-semibold text-neutral-900">10% over benchmark</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-700 font-gruppo">Minimum Review</span>
                  <span className="font-work-sans font-semibold text-neutral-900">Quarterly</span>
                </div>
              </div>
              <Link
                href="/register"
                className="block text-center px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth shadow-lg shadow-gold-500/20"
              >
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12">
            <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-6">
              Let's Craft Your <span className="text-gold-600">Financial Legacy</span>
            </h2>
            <p className="text-lg text-neutral-600 font-gruppo mb-8 max-w-2xl mx-auto">
              Schedule a confidential consultation with our wealth management team. Discover how Swiss precision 
              and global expertise can elevate your financial strategy.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth shadow-lg shadow-gold-500/20 active:scale-95"
            >
              <span>Request Membership</span>
              <ArrowRight size={20} />
            </Link>
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
            "name": "Wealth Management Services",
            "description": "Bespoke wealth management and investment services for high net worth individuals",
            "provider": {
              "@type": "BankOrCreditUnion",
              "name": "Concierge Bank",
              "url": "https://conciergebank.us"
            },
            "serviceType": "Wealth Management",
            "areaServed": {
              "@type": "Country",
              "name": "United States"
            },
            "offers": {
              "@type": "Offer",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "price": "500000",
                "priceCurrency": "USD",
                "description": "Minimum assets under management"
              }
            }
          })
        }}
      />
    </div>
  );
}
