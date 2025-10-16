import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Shield, Sparkles, Users, Globe2, Award, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - Our Heritage & Values",
  description: "Concierge Bank, a Richemont Financial subsidiary, brings Swiss precision banking to America. Discover our heritage, values, and commitment to exceptional private banking.",
  alternates: {
    canonical: "https://conciergebank.us/about",
  },
  openGraph: {
    title: "About Concierge Bank - Swiss Precision Meets American Excellence",
    description: "As a family-spirited banking institution under Richemont, we take a long-term view in nurturing wealth and building enduring relationships.",
    url: "https://conciergebank.us/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light-50 via-light-100 to-light-200">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span className="text-sm font-gruppo text-neutral-700">A Richemont Financial Subsidiary</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-work-sans font-bold text-neutral-900 mb-6">
              We Craft <span className="text-gold-600">Your Financial Future</span>
            </h1>
            <p className="text-xl text-neutral-600 font-gruppo max-w-3xl mx-auto leading-relaxed">
              As a family-spirited banking institution, Concierge Bank takes a long-term view in nurturing wealth. 
              We support our clients in achieving exceptional financial outcomes, true to their values and aligned with their vision.
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-4xl font-work-sans font-bold text-gold-600 mb-2">Since 2024</p>
              <p className="text-sm font-gruppo text-neutral-600">Bringing Swiss Precision to America</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-4xl font-work-sans font-bold text-gold-600 mb-2">$2.5B+</p>
              <p className="text-sm font-gruppo text-neutral-600">Assets Under Management</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-4xl font-work-sans font-bold text-gold-600 mb-2">1,200+</p>
              <p className="text-sm font-gruppo text-neutral-600">High Net Worth Clients</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-4xl font-work-sans font-bold text-gold-600 mb-2">98.5%</p>
              <p className="text-sm font-gruppo text-neutral-600">Client Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Heritage */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-6">
                Heritage Rooted in <span className="text-gold-600">Excellence</span>
              </h2>
              <p className="text-lg text-neutral-700 font-gruppo leading-relaxed mb-6">
                Concierge Bank was established in 2024 as a subsidiary of <strong>Compagnie Financière Richemont SA</strong>, 
                one of the world&apos;s most respected luxury conglomerates. Founded by Johann Rupert in 1988, Richemont has 
                cultivated a legacy of nurturing exceptional Maisons—from Cartier and Van Cleef & Arpels to IWC Schaffhausen 
                and Jaeger-LeCoultre.
              </p>
              <p className="text-lg text-neutral-700 font-gruppo leading-relaxed mb-6">
                We inherited this same philosophy: <strong>a long-term view, meticulous craftsmanship, and an unwavering 
                commitment to authenticity</strong>. Just as Richemont nurtures its Maisons with patience and respect for 
                their heritage, we nurture our clients&apos; wealth with Swiss precision and American dynamism.
              </p>
              <div className="flex items-start space-x-3 mb-4">
                <Award className="w-6 h-6 text-gold-600 mt-1" />
                <div>
                  <p className="font-work-sans font-semibold text-neutral-900">FDIC Insured</p>
                  <p className="text-sm text-neutral-600 font-gruppo">Your deposits protected up to $250,000</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-gold-600 mt-1" />
                <div>
                  <p className="font-work-sans font-semibold text-neutral-900">Swiss Banking Standards</p>
                  <p className="text-sm text-neutral-600 font-gruppo">Privacy, security, and discretion</p>
                </div>
              </div>
            </div>
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-600/20 to-gold-800/20 z-10" />
              <Image
                src="/logos/emblem.png"
                alt="Concierge Bank Heritage - Richemont Financial Excellence"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-4">
              What Makes Us <span className="text-gold-600">Different</span>
            </h2>
            <p className="text-lg text-neutral-600 font-gruppo max-w-3xl mx-auto">
              At Concierge Bank, our true strength lies not in uniformity, but in the rich diversity of our expertise, 
              cultures, and our ability to foster untapped potential in every client relationship.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-4">
                Enduring Relationships
              </h3>
              <p className="text-neutral-700 font-gruppo leading-relaxed">
                We believe in partnerships that span generations. Our commitment to long-term value has attracted and retained 
                exceptional clients who trust us with their wealth across decades, not quarters.
              </p>
            </div>

            {/* Value 2 */}
            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-4">
                Authenticity & Uniqueness
              </h3>
              <p className="text-neutral-700 font-gruppo leading-relaxed">
                We value your individuality. Your financial strategy should be as unique as your fingerprint—tailored to your 
                specific goals, risk tolerance, and life vision. No cookie-cutter solutions.
              </p>
            </div>

            {/* Value 3 */}
            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-gold-600 to-gold-700 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-work-sans font-bold text-neutral-900 mb-4">
                Discretion & Privacy
              </h3>
              <p className="text-neutral-700 font-gruppo leading-relaxed">
                Swiss banking is synonymous with confidentiality. We uphold the highest standards of privacy and discretion, 
                protecting your personal and financial information with the same care Richemont applies to its finest creations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Globe2 className="w-16 h-16 text-gold-600 mx-auto mb-6" />
            <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-4">
              Global Reach, <span className="text-gold-600">Personal Touch</span>
            </h2>
            <p className="text-lg text-neutral-600 font-gruppo max-w-3xl mx-auto">
              As part of the Richemont Group&apos;s global network, we leverage international expertise while maintaining 
              the personalized service you expect from a private bank.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-4">🇺🇸 United States Headquarters</h3>
              <p className="text-neutral-700 font-gruppo mb-2">Wall Street Financial District</p>
              <p className="text-neutral-700 font-gruppo mb-2">New York, NY 10005</p>
              <p className="text-neutral-700 font-gruppo">United States</p>
            </div>

            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-4">🇨🇭 Swiss Operations</h3>
              <p className="text-neutral-700 font-gruppo mb-2">Rue du Rhône</p>
              <p className="text-neutral-700 font-gruppo mb-2">Geneva, 1204</p>
              <p className="text-neutral-700 font-gruppo">Switzerland</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12">
            <h2 className="text-4xl font-work-sans font-bold text-neutral-900 mb-6">
              Begin Your Journey with <span className="text-gold-600">Concierge Bank</span>
            </h2>
            <p className="text-lg text-neutral-600 font-gruppo mb-8 max-w-2xl mx-auto">
              Experience private banking the way it was meant to be—personalized, discreet, and backed by 
              the legacy of Richemont&apos;s commitment to excellence.
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
                href="/services"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 glass text-neutral-700 rounded-lg font-work-sans font-semibold hover:glass-gold transition-smooth shadow-md active:scale-95"
              >
                <span>Explore Services</span>
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
            "@type": "AboutPage",
            "name": "About Concierge Bank",
            "description": "Concierge Bank is a Richemont Financial subsidiary bringing Swiss precision banking to America with exclusive private banking and wealth management services.",
            "url": "https://conciergebank.us/about",
            "mainEntity": {
              "@type": "BankOrCreditUnion",
              "name": "Concierge Bank",
              "foundingDate": "2024",
              "parentOrganization": {
                "@type": "Organization",
                "name": "Compagnie Financière Richemont SA",
                "url": "https://www.richemont.com"
              }
            }
          })
        }}
      />
    </div>
  );
}
