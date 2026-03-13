"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import CanvasScene from "@/components/CanvasScene";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollSection from "@/components/ScrollSection";
import TrustBadges from "@/components/TrustBadges";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Shield,
  Lock,
  Zap,
  Globe,
  Phone,
  ArrowRight,
  CheckCircle2,
  Star,
  TrendingUp,
  Users,
  Award,
  CreditCard,
  Building2,
  Wallet,
  BarChart3,
  HeadphonesIcon,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { value: "$2.4T", label: "Assets Under Management" },
  { value: "180+", label: "Countries Served" },
  { value: "125K+", label: "Private Clients" },
  { value: "Since 1988", label: "Swiss Heritage" },
];

const cardTiers = [
  {
    tier: "Gold",
    tagline: "Your gateway to Maison privileges",
    limit: "$50,000",
    apr: "16.99%–22.99% Variable APR",
    rewards: "2x points on Maison purchases",
    annualFee: "$295 Annual Fee",
    highlight: false,
    features: [
      "Worldwide acceptance at 50M+ merchants",
      "2% Maison Returns on all purchases",
      "Travel accident & delay insurance",
      "Zero foreign transaction fees",
      "24/7 concierge assistance",
    ],
  },
  {
    tier: "Platinum",
    tagline: "Reserved for the distinguished few",
    limit: "$250,000",
    apr: "14.99%–19.99% Variable APR",
    rewards: "4x points on luxury & travel",
    annualFee: "$895 Annual Fee",
    highlight: true,
    features: [
      "Priority Pass™ airport lounge access",
      "4% Maison Returns on all purchases",
      "Geneva Concierge — 24/7 dedicated advisor",
      "Global travel & emergency assistance",
      "Exclusive event pre-sale access",
    ],
  },
  {
    tier: "Black",
    tagline: "By invitation. Without limits.",
    limit: "Unlimited",
    apr: "12.99% Variable APR",
    rewards: "8x points — Maison tier",
    annualFee: "$2,500 Annual Fee",
    highlight: false,
    features: [
      "Private aviation access & upgrades",
      "8% Maison Privileges on all spend",
      "Dedicated personal attaché",
      "Estate & art acquisition advisory",
      "Invitation-only Richemont events",
    ],
  },
];

const whyUs = [
  {
    icon: <Shield className="w-7 h-7 text-gold-600" />,
    title: "FDIC Insured Up to $250,000",
    desc: "Your deposits are protected by the Federal Deposit Insurance Corporation — the same guarantee trusted by millions of Americans.",
  },
  {
    icon: <Lock className="w-7 h-7 text-gold-600" />,
    title: "Swiss-Grade Security",
    desc: "256-bit AES encryption, biometric authentication, and real-time fraud monitoring modeled on FINMA standards.",
  },
  {
    icon: <Zap className="w-7 h-7 text-gold-600" />,
    title: "Instant Transfers",
    desc: "Move funds between accounts in seconds. External wires clear in 1–3 business days with zero transfer fees.",
  },
  {
    icon: <HeadphonesIcon className="w-7 h-7 text-gold-600" />,
    title: "24/7 Private Banking Line",
    desc: "Reach a dedicated relationship manager any time, day or night. No queues, no bots — just your personal advisor.",
  },
  {
    icon: <Globe className="w-7 h-7 text-gold-600" />,
    title: "Global Acceptance",
    desc: "Accepted in 180+ countries. Multi-currency accounts with real-time exchange rates. Zero foreign transaction fees.",
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-gold-600" />,
    title: "Elite Returns",
    desc: "Industry-leading APY on savings accounts. Priority access to exclusive investment vehicles not available to retail clients.",
  },
];

const services = [
  { icon: <Wallet className="w-6 h-6" />, name: "Checking & Savings", desc: "High-yield accounts with no monthly minimums" },
  { icon: <CreditCard className="w-6 h-6" />, name: "Elite Credit Cards", desc: "Maison-tier rewards and unlimited travel perks" },
  { icon: <BarChart3 className="w-6 h-6" />, name: "Wealth Management", desc: "Bespoke portfolio curation from Geneva advisors" },
  { icon: <Building2 className="w-6 h-6" />, name: "Private Banking", desc: "Discreet, relationship-first banking at scale" },
  { icon: <Globe className="w-6 h-6" />, name: "International Wires", desc: "SWIFT transfers to 180+ countries, same day" },
  { icon: <Award className="w-6 h-6" />, name: "Maison Privileges", desc: "Cartier, Van Cleef & Arpels acquisition advisory" },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-eyebrow", { opacity: 0, y: 20, duration: 0.7, ease: "power3.out", delay: 0.2 });
      gsap.from(".hero-heading", { opacity: 0, y: 40, duration: 0.9, ease: "power4.out", delay: 0.4 });
      gsap.from(".hero-sub", { opacity: 0, y: 24, duration: 0.8, ease: "power3.out", delay: 0.7 });
      gsap.from(".hero-ctas", { opacity: 0, y: 20, duration: 0.7, ease: "power3.out", delay: 0.95 });
      gsap.from(".hero-trust", { opacity: 0, y: 16, duration: 0.6, ease: "power3.out", delay: 1.1 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <CanvasScene />
      <Navbar />

      <main className="relative z-10">

        {/* ─── HERO ─── */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center pt-24 md:pt-32 pb-16 px-6 sm:px-8"
        >
          <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl lg:max-w-none">
              {/* Eyebrow */}
              <div className="hero-eyebrow inline-flex items-center space-x-2 px-4 py-2 bg-gold-50 border border-gold-200/70 rounded-full mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-xs font-work-sans font-bold tracking-widest uppercase text-gold-700">
                  A Compagnie Financière Richemont SA Company
                </span>
              </div>

              {/* Headline */}
              <h1 className="hero-heading font-work-sans font-extrabold tracking-tight text-neutral-900 mb-6 leading-[1.05]">
                <span className="block text-5xl sm:text-6xl md:text-7xl">Banking forged</span>
                <span className="block text-5xl sm:text-6xl md:text-7xl">in Swiss precision.</span>
                <span className="block gradient-text text-5xl sm:text-6xl md:text-7xl mt-1">Refined for you.</span>
              </h1>

              {/* Sub */}
              <p className="hero-sub text-lg sm:text-xl text-neutral-600 max-w-2xl leading-relaxed font-gruppo mb-10">
                Concierge Bank brings the heritage of Maison Richemont to private banking in America — FDIC-insured accounts, elite credit cards, and a dedicated relationship manager, all in one platform.
              </p>

              {/* CTAs */}
              <div className="hero-ctas flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
                <Link
                  href="/register"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-white font-work-sans font-bold text-base rounded-xl shadow-xl shadow-gold-500/25 hover:shadow-2xl hover:shadow-gold-500/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span>Open an Account</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-white hover:bg-neutral-50 text-neutral-800 font-work-sans font-semibold text-base rounded-xl border border-neutral-200 hover:border-gold-300 transition-all duration-300 shadow-sm"
                >
                  <span>Sign In to My Account</span>
                </Link>
              </div>

              {/* Inline trust signals */}
              <div className="hero-trust flex flex-wrap items-center gap-x-6 gap-y-2">
                {["FDIC Insured", "FINMA Regulated", "PCI DSS Level 1", "256-bit Encryption"].map((t) => (
                  <span key={t} className="flex items-center space-x-1.5 text-sm text-neutral-500 font-gruppo">
                    <CheckCircle2 size={14} className="text-gold-500 flex-shrink-0" />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right column — intentionally empty so the particle globe shows through */}
            <div className="hidden lg:block" aria-hidden="true" />
          </div>
        </section>

        {/* ─── STATS BAR ─── */}
        <section className="relative z-10 bg-neutral-900 py-10">
          <div className="container mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-work-sans font-extrabold gradient-text mb-1">{s.value}</p>
                  <p className="text-sm text-neutral-400 font-gruppo tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ABOUT ─── */}
        <ScrollSection className="section-padding" animationType="fade" id="about">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gold-50 border border-gold-200/60 rounded-full mb-6">
                  <span className="text-xs font-work-sans font-bold tracking-widest uppercase text-gold-700">Our Heritage</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-work-sans font-extrabold text-neutral-900 tracking-tight mb-6 leading-tight">
                  Swiss precision.<br />
                  <span className="gradient-text">Maison craftsmanship.</span>
                </h2>
                <p className="text-neutral-600 text-lg leading-relaxed font-gruppo mb-6">
                  Born from the heritage of <strong className="text-neutral-900 font-work-sans">Compagnie Financière Richemont SA</strong>, Concierge Bank serves those who appreciate life&apos;s finest pursuits — the financial architects for clients of Cartier, Van Cleef &amp; Arpels, and every distinguished Maison.
                </p>
                <p className="text-neutral-600 text-lg leading-relaxed font-gruppo mb-8">
                  With Swiss precision and Maison craftsmanship, we curate wealth experiences as meticulously as our sister houses craft their masterpieces. Private banking for the connoisseur — discreet, refined, uncompromising.
                </p>
                <Link href="/about" className="inline-flex items-center space-x-2 text-gold-700 font-work-sans font-semibold hover:text-gold-600 transition-colors group">
                  <span>Learn about our story</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="space-y-4">
                <div className="py-8">
                  <TrustBadges variant="compact" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <Users className="w-5 h-5 text-gold-600" />, label: "125,000+", sub: "Private Clients" },
                    { icon: <Star className="w-5 h-5 text-gold-600" />, label: "4.9 / 5.0", sub: "Client Satisfaction" },
                    { icon: <Award className="w-5 h-5 text-gold-600" />, label: "#1 Ranked", sub: "Private Bank USA 2024" },
                    { icon: <Globe className="w-5 h-5 text-gold-600" />, label: "180+ Nations", sub: "Global Network" },
                  ].map((item, i) => (
                    <div key={i} className="p-5 bg-white border border-neutral-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gold-200 transition-all duration-300">
                      <div className="w-9 h-9 rounded-xl bg-gold-50 flex items-center justify-center mb-3">{item.icon}</div>
                      <p className="font-work-sans font-extrabold text-neutral-900 text-lg">{item.label}</p>
                      <p className="text-xs text-neutral-500 font-gruppo">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollSection>

        {/* ─── SERVICES GRID ─── */}
        <ScrollSection
          className="section-padding bg-gradient-to-b from-neutral-50 to-white"
          animationType="fade"
          id="services"
        >
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gold-50 border border-gold-200/60 rounded-full mb-5">
                <span className="text-xs font-work-sans font-bold tracking-widest uppercase text-gold-700">What We Offer</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-work-sans font-extrabold text-neutral-900 tracking-tight mb-4">
                Full-service banking.<br /><span className="gradient-text">Extraordinary standards.</span>
              </h2>
              <p className="text-neutral-500 text-lg font-gruppo max-w-2xl mx-auto">
                From everyday checking to private equity — every financial need, handled with Maison-level discretion.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <div
                  key={i}
                  className="group p-7 bg-white border border-neutral-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-gold-200 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-50 group-hover:bg-gold-100 flex items-center justify-center text-gold-600 mb-5 transition-colors duration-300">
                    {s.icon}
                  </div>
                  <h3 className="font-work-sans font-bold text-neutral-900 text-lg mb-2">{s.name}</h3>
                  <p className="text-neutral-500 text-sm font-gruppo leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollSection>

        {/* ─── CARDS ─── */}
        <ScrollSection
          className="section-padding bg-gradient-to-b from-white via-gold-50/20 to-white"
          animationType="scale"
          id="cards"
        >
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gold-50 border border-gold-200/60 rounded-full mb-5">
                <span className="text-xs font-work-sans font-bold tracking-widest uppercase text-gold-700">The Maison Collection</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-work-sans font-extrabold text-neutral-900 tracking-tight mb-4">
                Cards that reflect<br /><span className="gradient-text">who you are.</span>
              </h2>
              <p className="text-neutral-500 text-lg font-gruppo max-w-2xl mx-auto">
                Each tier is engineered for a different kind of ambition. Rewards, limits, and privileges that grow with you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {cardTiers.map((card, idx) => (
                <div
                  key={idx}
                  className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                    card.highlight
                      ? "shadow-2xl shadow-gold-500/20 ring-2 ring-gold-400"
                      : "shadow-lg shadow-neutral-200/80 border border-neutral-100 hover:shadow-xl hover:border-gold-200"
                  }`}
                >
                  {card.highlight && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600" />
                  )}
                  {card.highlight && (
                    <div className="absolute top-4 right-4 px-2.5 py-1 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-[10px] font-work-sans font-bold tracking-wider uppercase rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}

                  {/* Card header */}
                  <div className={`px-8 pt-8 pb-6 ${card.highlight ? "bg-gradient-to-br from-neutral-900 to-neutral-800" : "bg-white"}`}>
                    <p className={`text-xs font-work-sans font-bold tracking-widest uppercase mb-2 ${card.highlight ? "text-gold-400" : "text-gold-600"}`}>
                      {card.tier}
                    </p>
                    <h3 className={`text-2xl font-work-sans font-extrabold mb-1 ${card.highlight ? "text-white" : "text-neutral-900"}`}>
                      {card.tagline}
                    </h3>
                    <p className={`text-sm font-gruppo mt-2 ${card.highlight ? "text-neutral-400" : "text-neutral-500"}`}>
                      {card.apr}
                    </p>
                  </div>

                  {/* Card body */}
                  <div className={`flex-1 px-8 py-6 ${card.highlight ? "bg-neutral-900" : "bg-white"}`}>
                    <div className="flex items-baseline space-x-1 mb-1">
                      <span className={`text-3xl font-work-sans font-extrabold ${card.highlight ? "text-white" : "text-neutral-900"}`}>
                        {card.limit}
                      </span>
                      {card.limit !== "Unlimited" && (
                        <span className={`text-sm font-gruppo ${card.highlight ? "text-neutral-400" : "text-neutral-500"}`}>credit limit</span>
                      )}
                    </div>
                    <p className={`text-sm font-work-sans font-semibold mb-1 ${card.highlight ? "text-gold-400" : "text-gold-600"}`}>
                      {card.rewards}
                    </p>
                    <p className={`text-xs font-gruppo mb-6 ${card.highlight ? "text-neutral-500" : "text-neutral-400"}`}>
                      {card.annualFee}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {card.features.map((f, i) => (
                        <li key={i} className="flex items-start space-x-2.5">
                          <CheckCircle2 size={15} className={`flex-shrink-0 mt-0.5 ${card.highlight ? "text-gold-400" : "text-gold-500"}`} />
                          <span className={`text-sm font-gruppo leading-relaxed ${card.highlight ? "text-neutral-300" : "text-neutral-600"}`}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/register"
                      className={`block w-full text-center py-3 rounded-xl text-sm font-work-sans font-bold transition-all duration-200 ${
                        card.highlight
                          ? "bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white shadow-lg shadow-gold-500/30"
                          : "bg-neutral-900 hover:bg-neutral-800 text-white"
                      }`}
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-neutral-400 font-gruppo mt-8 max-w-3xl mx-auto">
              Subject to credit approval. Variable APR based on creditworthiness and Prime Rate. See Cardholder Agreement for full terms. Rates effective as of 2025.
            </p>
          </div>
        </ScrollSection>

        {/* ─── WHY US ─── */}
        <ScrollSection className="section-padding bg-neutral-950" animationType="fade" id="why-us">
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-5">
                <span className="text-xs font-work-sans font-bold tracking-widest uppercase text-gold-400">Why Concierge Bank</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-work-sans font-extrabold text-white tracking-tight mb-4">
                The standard other banks<br /><span className="gradient-text">aspire to reach.</span>
              </h2>
              <p className="text-neutral-400 text-lg font-gruppo max-w-2xl mx-auto">
                We built the banking experience we wished existed — combining institutional rigor with the intimacy of a private family office.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyUs.map((item, i) => (
                <div
                  key={i}
                  className="p-7 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/8 hover:border-gold-500/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="font-work-sans font-bold text-white text-lg mb-3">{item.title}</h3>
                  <p className="text-neutral-400 text-sm font-gruppo leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollSection>

        {/* ─── FINAL CTA ─── */}
        <ScrollSection
          className="section-padding bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden"
          animationType="fade"
          id="contact"
        >
          {/* Decorative gold glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold-500/10 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 sm:px-8 text-center max-w-3xl relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8">
              <span className="text-xs font-work-sans font-bold tracking-widest uppercase text-gold-400">Begin Your Journey</span>
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-work-sans font-extrabold text-white tracking-tight mb-6 leading-tight">
              Banking worthy<br />
              <span className="gradient-text">of your legacy.</span>
            </h2>
            <p className="text-neutral-300 text-lg md:text-xl font-gruppo leading-relaxed mb-10 max-w-2xl mx-auto">
              Join 125,000+ distinguished clients who trust Concierge Bank with their most private financial affairs. Opening takes under 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/register"
                className="inline-flex items-center space-x-2 px-10 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white font-work-sans font-bold text-lg rounded-xl shadow-2xl shadow-gold-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Open Your Account</span>
                <ArrowRight size={20} />
              </Link>
              <a
                href="tel:+18002662434"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-work-sans font-semibold text-base rounded-xl transition-all duration-300"
              >
                <Phone size={18} />
                <span>1-800-CONCIERGE</span>
              </a>
            </div>
            <p className="text-neutral-500 text-xs font-gruppo">
              FDIC Insured · No hidden fees · Cancel anytime · US residents only
            </p>
          </div>
        </ScrollSection>
      </main>

      <Footer />
    </>
  );
}
