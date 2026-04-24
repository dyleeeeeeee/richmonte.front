"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandSlider from "@/components/BrandSlider";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bell,
  Send,
  ShieldCheck,
  PieChart,
  ArrowRight,
  User as UserIcon,
  Lock,
  ChevronRight,
  Briefcase,
  Lightbulb,
  CreditCard,
} from "lucide-react";

// ─── Static content ────────────────────────────────────────────────────────
const PATHS = [
  { label: "Personal Banking", icon: <UserIcon size={16} />, href: "/#accounts" },
  { label: "Business Growth", icon: <Briefcase size={16} />, href: "/#business" },
  { label: "Financial Advice", icon: <Lightbulb size={16} />, href: "/wealth-management" },
];

const TOOLS = [
  {
    icon: <Bell className="w-5 h-5 text-navy-700" />,
    title: "Real-time Alerts",
    desc: "Stay informed instantly.",
  },
  {
    icon: <Send className="w-5 h-5 text-navy-700" />,
    title: "Instant Transfers",
    desc: "Move money effortlessly.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-navy-700" />,
    title: "Credit Monitoring",
    desc: "Track your score easily.",
  },
  {
    icon: <PieChart className="w-5 h-5 text-navy-700" />,
    title: "Smart Budgeting",
    desc: "Manage finances better.",
  },
];

// ─── Inline sign-in (hero card) ────────────────────────────────────────────
function InlineSignIn() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-3 md:items-end"
    >
      {/* Username */}
      <div className="md:col-span-4 flex flex-col gap-1.5">
        <label htmlFor="hero-email" className="text-xs font-semibold text-neutral-700">
          Username
        </label>
        <div className="relative">
          <UserIcon
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            id="hero-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 transition"
            placeholder="you@invbank.us"
          />
        </div>
      </div>

      {/* Password */}
      <div className="md:col-span-4 flex flex-col gap-1.5">
        <label htmlFor="hero-password" className="text-xs font-semibold text-neutral-700">
          Password
        </label>
        <div className="relative">
          <Lock
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            id="hero-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 transition"
            placeholder="••••••••"
          />
        </div>
      </div>

      {/* Sign in button */}
      <div className="md:col-span-4 flex flex-col gap-1.5">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white text-sm font-bold rounded-lg shadow-sm transition"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
        <Link
          href="/register"
          className="text-xs text-navy-700 hover:underline text-center md:text-right"
        >
          Set up online access
        </Link>
      </div>

      {/* Secondary row: remember + forgot */}
      <div className="md:col-span-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-neutral-600">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-3.5 h-3.5 accent-navy-700"
          />
          <span>Remember me</span>
        </label>
        <Link href="/login" className="text-navy-700 hover:underline">
          Forgot username or password?
        </Link>
      </div>

      {error && (
        <p
          role="alert"
          className="md:col-span-12 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2"
        >
          {error}
        </p>
      )}
    </form>
  );
}

// ─── Stylized phone mockup (SVG) for "Next-Gen Digital Tools" section ─────
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[240px] md:w-[260px]">
      <div className="rounded-[40px] bg-neutral-900 p-2 shadow-2xl shadow-navy-900/20">
        <div className="rounded-[32px] bg-gradient-to-b from-navy-700 to-navy-900 overflow-hidden aspect-[9/19] flex flex-col">
          {/* Notch */}
          <div className="mx-auto mt-2 w-24 h-5 bg-neutral-900 rounded-b-2xl" />

          {/* App header */}
          <div className="px-4 pt-4 pb-3 flex items-center justify-between">
            <svg viewBox="0 0 40 40" className="w-5 h-5" aria-hidden>
              <path d="M20 4 L36 32 L28 32 L20 18 L12 32 L4 32 Z" fill="#FFFFFF" />
            </svg>
            <span className="text-[10px] font-bold text-white/80 tracking-wide">InvBank</span>
            <CreditCard size={12} className="text-white/70" />
          </div>

          {/* Balance */}
          <div className="px-4">
            <p className="text-[9px] uppercase tracking-widest text-white/60 font-semibold">
              Account Overview
            </p>
            <p className="text-white font-extrabold text-xl mt-0.5">$71,625.00</p>
          </div>

          {/* Account list */}
          <div className="mt-3 flex-1 bg-white rounded-t-2xl px-3 py-3 space-y-2 overflow-hidden">
            <p className="text-[9px] font-bold tracking-wide uppercase text-neutral-500 px-1">
              Accounts
            </p>
            {[
              { name: "Credit Horizon", v: "-$312.30", neg: true },
              { name: "Ambition Checking", v: "$12,984.22" },
              { name: "Growth Savings", v: "$36,120.50" },
              { name: "Emergency Fund", v: "$8,432.10" },
              { name: "Roth IRA", v: "$13,988.18" },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-neutral-50 border border-neutral-100"
              >
                <span className="text-[10px] font-semibold text-neutral-700">{row.name}</span>
                <span
                  className={`text-[10px] font-mono font-bold ${
                    row.neg ? "text-red-500" : "text-neutral-900"
                  }`}
                >
                  {row.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative bg-light-100 text-neutral-900">
        {/* Spacer for fixed navbar (FDIC + utility + nav ≈ 56 + ~64 = 120px) */}
        <div className="pt-[120px] md:pt-[148px]" />

        {/* ─── HERO ─── */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Inline sign-in */}
          <InlineSignIn />

          {/* Hero card */}
          <div
            className="mt-6 rounded-2xl overflow-hidden relative shadow-sm border border-light-300"
            style={{
              // Navy overlay tuned to the Apex reference — desaturated steel-blue
              backgroundImage:
                "linear-gradient(100deg, rgba(23,34,58,0.85) 0%, rgba(33,48,72,0.55) 45%, rgba(33,48,72,0.0) 70%), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center right",
            }}
          >
            <div className="py-16 sm:py-20 md:py-28 px-6 sm:px-10 md:px-14 max-w-xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
                Banking Built for
                <br />
                Your Ambition
              </h1>
              <p className="mt-5 text-sm sm:text-base text-white/85 font-gruppo max-w-md leading-relaxed">
                Plus, enjoy no monthly fees, no maintenance fees and no overdraft fees.
              </p>
              <Link
                href="/register"
                className="mt-7 inline-flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white text-sm font-bold rounded-full shadow-lg shadow-navy-950/40 transition"
              >
                Explore Accounts
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── CHOOSE A PATH ─── */}
        <section id="accounts" className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-14 pb-16">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-700">
              Choose a Path
            </h2>
            <ChevronRight size={16} className="text-neutral-500" />
          </div>
          <div className="flex flex-wrap gap-3">
            {PATHS.map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-700 hover:bg-navy-800 text-white text-sm font-semibold rounded-full shadow-sm transition"
              >
                <span className="opacity-80">{p.icon}</span>
                <span>{p.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── NEXT-GEN DIGITAL TOOLS ─── */}
        <section
          id="tools"
          className="bg-white border-y border-neutral-100 py-20 md:py-24"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <h2 className="text-center text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-neutral-800 mb-12">
              Next-Gen Digital Tools
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-10 md:gap-14">
              {/* Left features */}
              <div className="flex flex-col gap-10 order-2 md:order-1">
                {[TOOLS[0], TOOLS[1]].map((t) => (
                  <div key={t.title} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      {t.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{t.title}:</p>
                      <p className="text-sm text-neutral-600 font-gruppo">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phone */}
              <div className="order-1 md:order-2">
                <PhoneMockup />
              </div>

              {/* Right features */}
              <div className="flex flex-col gap-10 order-3">
                {[TOOLS[2], TOOLS[3]].map((t) => (
                  <div key={t.title} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      {t.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{t.title}:</p>
                      <p className="text-sm text-neutral-600 font-gruppo">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── BRAND SLIDER (ported from landing-page/slider.*) ─── */}
        <section id="experience">
          <BrandSlider />
        </section>

        {/* ─── CARDS CTA ─── */}
        <section
          id="cards"
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-20 bg-light-100"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Everyday Checking",
                desc: "Zero monthly fees. Mobile-first. FDIC insured to $250,000.",
                href: "/register",
                cta: "Open Checking",
              },
              {
                title: "Ambition Credit Card",
                desc: "2% cash back on everything. No annual fee. Build your credit.",
                href: "/#cards",
                cta: "Apply Now",
              },
              {
                title: "Invest & Trade",
                desc: "Commission-free stocks, ETFs and crypto. Real-time market data.",
                href: "/dashboard/trade",
                cta: "Start Trading",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="p-7 bg-light-50 border border-light-300 rounded-2xl hover:border-navy-400 hover:shadow-md transition-all duration-300"
              >
                <h3 className="font-work-sans font-bold text-lg text-neutral-900 mb-2">
                  {c.title}
                </h3>
                <p className="text-sm text-neutral-600 font-gruppo leading-relaxed mb-5">
                  {c.desc}
                </p>
                <Link
                  href={c.href}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-navy-700 hover:text-navy-800 group"
                >
                  {c.cta}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
