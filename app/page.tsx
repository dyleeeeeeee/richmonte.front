"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CanvasScene from "@/components/CanvasScene";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollSection from "@/components/ScrollSection";
import TrustBadges from "@/components/TrustBadges";
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
      .fromTo(
        ".hero-tagline",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          clearProps: "all"
        },
        "-=0.5"
      );
    return smoothScroll();
  }, []);

  return (
    <>
      {/* Particle Sphere - Animates as user scrolls */}
      <CanvasScene />
      
      {/* Navigation */}
      <Navbar />

      <main className="relative z-10">
        {/* Hero Section - Particle Sphere Intro */}
        <section className="min-h-screen flex items-center justify-center px-6 sm:px-8">
          <div className="text-center space-y-12 max-w-5xl mx-auto">
            <h1 className="overflow-hidden">
              <div className="flex flex-col items-center space-y-3">
                <span className="hero-word gradient-text glow-gold text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight">Swiss</span>
                <span className="hero-word gradient-text glow-gold text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight">Heritage.</span>
                <span className="hero-word gradient-text glow-gold text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight">Richemont</span>
                <span className="hero-word gradient-text glow-gold text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight">Excellence.</span>
              </div>
            </h1>
            <p className="hero-tagline text-lg sm:text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
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
              {/* Richemont Banner Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative w-full max-w-md h-32">
                  <Image
                    src="/logos/banner.png"
                    alt="Compagnie Financière Richemont SA"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              <h2 className="text-center gradient-text text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight mb-8">
                a subsidiary of Compagnie Financière Richemont SA
              </h2>
              
              {/* Trust Badges */}
              <div className="py-8 mb-8">
                <TrustBadges variant="compact" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 text-lg md:text-xl leading-relaxed">
                <p className="text-neutral-700 leading-loose">
                  Born from the heritage of <span className="text-gold-700 font-medium">Compagnie Financière Richemont SA</span>,
                  Concierge Bank serves those who appreciate life&apos;s finest pursuits. We are the financial architects
                  for clients of Cartier, Van Cleef & Arpels, and our distinguished Maisons.
                </p>
                <p className="text-neutral-700 leading-loose">
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
          <div className="container mx-auto px-6 sm:px-8">
            <h2 className="text-center gradient-text mb-20 text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight">The Maison Collection</h2>
            <div className="grid md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
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
                  className="group relative p-10 bg-white/70 backdrop-blur-sm border-2 border-gold-300/40 rounded-3xl hover:border-gold-500/80 transition-all duration-500 hover:transform hover:-translate-y-3 shadow-lg hover:shadow-2xl cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-100/0 to-gold-200/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-4xl md:text-5xl font-normal mb-3 text-gold-700">
                      {card.name}
                    </h3>
                    <p className="text-3xl md:text-4xl font-normal text-neutral-800">{card.limit}</p>
                    <ul className="space-y-4 pt-4">
                      {card.features.map((feature, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <span className="text-gold-600 text-xl mt-0.5">•</span>
                          <span className="text-neutral-700 text-base md:text-lg leading-relaxed">{feature}</span>
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
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl">
            <h2 className="text-center gradient-text mb-20 text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight">Swiss Banking Excellence</h2>
            <div className="grid md:grid-cols-2 gap-10 md:gap-12">
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
                  className="p-10 bg-white/60 backdrop-blur-sm border-2 border-gold-200/60 rounded-2xl hover:border-gold-400/80 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                >
                  <h3 className="text-2xl md:text-3xl font-normal mb-6 text-gold-700">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-700 text-base md:text-lg leading-loose">{feature.description}</p>
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
          <div className="container mx-auto px-6 sm:px-8 max-w-6xl">
            <h2 className="text-center gradient-text mb-20 text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight">Services</h2>
            <div className="grid md:grid-cols-2 gap-16 md:gap-20">
              <div>
                <div className="space-y-12">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-normal mb-5 text-gold-700">
                      Private Banking
                    </h3>
                    <ul className="space-y-3 text-neutral-600">
                      <li className="flex items-start space-x-3">
                        <span className="text-gold-600 text-lg mt-1">•</span>
                        <span className="text-base md:text-lg">Bespoke Portfolio Curation</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-gold-600 text-lg mt-1">•</span>
                        <span className="text-base md:text-lg">Swiss Investment Strategy</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-gold-600 text-lg mt-1">•</span>
                        <span className="text-base md:text-lg">Geneva Tax Structuring</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-gold-600 text-lg mt-1">•</span>
                        <span className="text-base md:text-lg">Legacy & Succession</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-normal mb-5 text-gold-700">
                      Wealth Curation
                    </h3>
                    <ul className="space-y-3 text-neutral-600">
                      <li className="flex items-start space-x-3">
                        <span className="text-gold-600 text-lg mt-1">•</span>
                        <span className="text-base md:text-lg">Fine Art & Collectibles</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-gold-600 text-lg mt-1">•</span>
                        <span className="text-base md:text-lg">Exclusive Market Access</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-gold-600 text-lg mt-1">•</span>
                        <span className="text-base md:text-lg">Risk Preservation</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-gold-600 text-lg mt-1">•</span>
                        <span className="text-base md:text-lg">Confidential Reporting</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="space-y-12">
                <div>
                  <h3 className="text-2xl md:text-3xl font-normal mb-5 text-gold-700">
                    Digital Vault
                  </h3>
                  <ul className="space-y-3 text-neutral-600">
                    <li className="flex items-start space-x-3">
                      <span className="text-gold-600 text-lg mt-1">•</span>
                      <span className="text-base md:text-lg">Swiss-Grade Security</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-gold-600 text-lg mt-1">•</span>
                      <span className="text-base md:text-lg">Real-time Intelligence</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-gold-600 text-lg mt-1">•</span>
                      <span className="text-base md:text-lg">Private API Access</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-gold-600 text-lg mt-1">•</span>
                      <span className="text-base md:text-lg">Encrypted Communications</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-normal mb-5 text-gold-700">
                    Maison Privileges
                  </h3>
                  <ul className="space-y-3 text-neutral-600">
                    <li className="flex items-start space-x-3">
                      <span className="text-gold-600 text-lg mt-1">•</span>
                      <span className="text-base md:text-lg">Private Aviation</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-gold-600 text-lg mt-1">•</span>
                      <span className="text-base md:text-lg">Exclusive Events</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-gold-600 text-lg mt-1">•</span>
                      <span className="text-base md:text-lg">Estate Management</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-gold-600 text-lg mt-1">•</span>
                      <span className="text-base md:text-lg">Maison Acquisitions</span>
                    </li>
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
          <div className="container mx-auto px-6 sm:px-8 text-center max-w-4xl">
            <h2 className="gradient-text glow-gold mb-12">
              <div className="flex flex-col items-center space-y-3">
                <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight">Begin</span>
                <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight">Your</span>
                <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight">Journey</span>
              </div>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 mb-16 max-w-3xl mx-auto leading-relaxed">
              Join the distinguished circle of Richemont clientele who expect nothing less than
              Swiss precision, Maison discretion, and unparalleled privilege.
            </p>
            <Link href="/register" className="inline-block px-14 py-5 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-full font-normal text-xl hover:from-gold-500 hover:to-gold-600 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-gold-500/30 hover:shadow-2xl">
              Request Membership
            </Link>
          </div>
        </ScrollSection>
      </main>

      <Footer />
    </>
  );
}
