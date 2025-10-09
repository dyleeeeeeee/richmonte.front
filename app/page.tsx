"use client";

import { useEffect } from "react";
import CanvasScene from "@/components/CanvasScene";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollSection from "@/components/ScrollSection";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  useEffect(() => {
    // Smooth scroll integration with GSAP
    const smoothScroll = () => {
      let scrollY = window.scrollY;
      const updateScroll = () => {
        scrollY += (window.scrollY - scrollY) * 0.1;
        ScrollTrigger.update();
      };
      gsap.ticker.add(updateScroll);
      return () => gsap.ticker.remove(updateScroll);
    };

    // Animate hero text on load
    const heroTimeline = gsap.timeline({ delay: 0.5 });
    heroTimeline
      .from(".hero-word", {
        opacity: 0,
        y: 100,
        rotationX: -90,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
      })
      .from(
        ".hero-tagline",
        {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.5"
      );
    return smoothScroll();
  }, []);

  return (
    <>
      {/* Particle Sphere - Animates as user scrolls */}
      <CanvasScene />

      <main className="relative z-10">
        {/* Hero Section - Particle Sphere Intro */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center space-y-8">
            <h1 className="overflow-hidden">
              <div className="flex flex-col items-center space-y-2">
                <span className="hero-word gradient-text glow-gold">Swiss</span>
                <span className="hero-word gradient-text glow-gold">Heritage.</span>
                <span className="hero-word gradient-text glow-gold">Richemont</span>
                <span className="hero-word gradient-text glow-gold">Excellence.</span>
              </div>
            </h1>
            <p className="hero-tagline text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto">
              Where Geneva&apos;s financial legacy meets the artistry of Maison Richemont
            </p>
          </div>
        </section>

        {/* About Section */}
        <ScrollSection
          className="section-padding"
          animationType="fade"
          id="about"
        >
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="space-y-12">
              <h2 className="text-center gradient-text">
                A Banking Subsidiary of Richemont Geneva
              </h2>
              <div className="grid md:grid-cols-2 gap-12 text-lg leading-relaxed">
                <p className="text-neutral-700">
                  Born from the heritage of <span className="text-gold-700 font-semibold">Richemont Geneva</span>,
                  Concierge Bank serves those who appreciate life&apos;s finest pursuits. We are the financial architects
                  for clients of Cartier, Van Cleef & Arpels, and our distinguished Maisons.
                </p>
                <p className="text-neutral-700">
                  With Swiss precision and Maison craftsmanship, we curate wealth experiences
                  as meticulously as our sister houses craft their masterpieces. This is private banking
                  for the connoisseur—discreet, refined, uncompromising.
                </p>
              </div>
            </div>
          </div>
        </ScrollSection>

        {/* Elite Cards Section */}
        <ScrollSection
          className="section-padding bg-gradient-to-b from-transparent via-gold-50/30 to-transparent"
          animationType="scale"
          id="cards"
        >
          <div className="container mx-auto px-6">
            <h2 className="text-center gradient-text mb-16">The Maison Collection</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Gold",
                  limit: "$50,000",
                  features: ["Worldwide Acceptance", "2% Maison Returns", "Elite Travel Coverage"],
                },
                {
                  name: "Platinum",
                  limit: "$250,000",
                  features: ["Private Lounge Access", "4% Maison Returns", "Geneva Concierge"],
                },
                {
                  name: "Black",
                  limit: "Unlimited",
                  features: ["Private Aviation", "8% Maison Privileges", "Dedicated Attaché"],
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="group relative p-8 bg-white/60 backdrop-blur-sm border border-gold-300/40 rounded-2xl hover:border-gold-500/80 transition-all duration-500 hover:transform hover:-translate-y-2 shadow-sm hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-100/0 to-gold-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="relative z-10">
                    <h3 className="text-3xl font-display font-bold mb-2 text-gold-700">
                      {card.name}
                    </h3>
                    <p className="text-4xl font-bold mb-6">{card.limit}</p>
                    <ul className="space-y-3">
                      {card.features.map((feature, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-gold-600 mt-1">•</span>
                          <span className="text-neutral-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollSection>

        {/* Concierge Features Section */}
        <ScrollSection className="section-padding" animationType="fade" id="concierge">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-center gradient-text mb-16">Swiss Banking Excellence</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Private Wealth Intelligence",
                  description:
                    "Geneva's finest financial minds at your service. Bespoke portfolio curation, exclusive market access, and insights reserved for Richemont clientele.",
                },
                {
                  title: "Swiss Precision Transfers",
                  description:
                    "Execute transactions with Swiss banking efficiency. Multi-currency settlements, zero fees between accounts, vault-secured verification.",
                },
                {
                  title: "Discreet Notifications",
                  description:
                    "Remain informed with refined intelligence. Real-time updates on transactions, exclusive opportunities, and curated market insights.",
                },
                {
                  title: "Maison Concierge",
                  description:
                    "Your personal attaché for life's finest moments. 24/7 access to Geneva advisors, Maison acquisitions, and bespoke lifestyle services.",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="p-8 bg-white/50 backdrop-blur-sm border border-gold-200/60 rounded-xl hover:border-gold-400/80 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <h3 className="text-2xl font-display font-bold mb-4 text-gold-700">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-700 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollSection>

        {/* Financial Tools Section */}
        <ScrollSection
          className="section-padding bg-gradient-to-b from-gold-50/20 to-transparent"
          animationType="slide"
        >
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h2 className="gradient-text mb-8">Services</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gold-700">
                      Private Banking
                    </h3>
                    <ul className="space-y-2 text-neutral-600">
                      <li>• Bespoke Portfolio Curation</li>
                      <li>• Swiss Investment Strategy</li>
                      <li>• Geneva Tax Structuring</li>
                      <li>• Legacy & Succession</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gold-700">
                      Wealth Curation
                    </h3>
                    <ul className="space-y-2 text-neutral-600">
                      <li>• Fine Art & Collectibles</li>
                      <li>• Exclusive Market Access</li>
                      <li>• Risk Preservation</li>
                      <li>• Confidential Reporting</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gold-700">
                    Digital Vault
                  </h3>
                  <ul className="space-y-2 text-neutral-600">
                    <li>• Swiss-Grade Security</li>
                    <li>• Real-time Intelligence</li>
                    <li>• Private API Access</li>
                    <li>• Encrypted Communications</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gold-700">
                    Maison Privileges
                  </h3>
                  <ul className="space-y-2 text-neutral-600">
                    <li>• Private Aviation</li>
                    <li>• Exclusive Events</li>
                    <li>• Estate Management</li>
                    <li>• Maison Acquisitions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ScrollSection>

        {/* Contact Section */}
        <ScrollSection
          className="section-padding min-h-screen flex items-center"
          animationType="fade"
          id="contact"
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="gradient-text glow-gold mb-8">
              <div className="flex flex-col items-center space-y-2">
                <span>Begin</span>
                <span>Your</span>
                <span>Journey</span>
              </div>
            </h2>
            <p className="text-xl text-neutral-600 mb-12 max-w-2xl mx-auto">
              Join the distinguished circle of Richemont clientele who expect nothing less than
              Swiss precision, Maison discretion, and unparalleled privilege.
            </p>
            <Link href="/register" className="inline-block px-12 py-4 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-full font-bold text-lg hover:from-gold-500 hover:to-gold-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-gold-500/30">
              Request Membership
            </Link>
          </div>
        </ScrollSection>
      </main>

      <Footer />
    </>
  );
}
