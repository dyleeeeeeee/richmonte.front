"use client";

import { useState, useRef, useEffect } from "react";
import { CreditCard as CreditCardIcon } from "lucide-react";

interface CreditCardProps {
  cardNumber: string;
  holder: string;
  expiryDate?: string;
  cvv?: string;
  tier: string;
  brand?: string;
  balance?: number;
  creditLimit?: number;
  status: string;
}

export default function CreditCard({
  cardNumber,
  holder,
  expiryDate = "MM/YY",
  cvv = "***",
  tier,
  brand,
  balance,
  creditLimit,
  status,
}: CreditCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Enhanced tier-specific styling
  const getTierConfig = () => {
    switch (tier) {
      case "Gold":
        return {
          gradient: "from-amber-400 via-yellow-500 to-amber-600",
          accent: "#F59E0B",
          shadow: "shadow-amber-500/25",
          chipColor: "from-yellow-300 to-yellow-500",
          textColor: "text-amber-900",
        };
      case "Platinum":
        return {
          gradient: "from-slate-300 via-slate-400 to-slate-500",
          accent: "#94A3B8",
          shadow: "shadow-slate-500/25",
          chipColor: "from-slate-200 to-slate-400",
          textColor: "text-slate-900",
        };
      case "Black":
        return {
          gradient: "from-neutral-800 via-neutral-900 to-black",
          accent: "#F59E0B",
          shadow: "shadow-black/50",
          chipColor: "from-neutral-600 to-neutral-800",
          textColor: "text-white",
        };
      default:
        return {
          gradient: "from-amber-400 via-yellow-500 to-amber-600",
          accent: "#F59E0B",
          shadow: "shadow-amber-500/25",
          chipColor: "from-yellow-300 to-yellow-500",
          textColor: "text-amber-900",
        };
    }
  };

  const tierConfig = getTierConfig();

  // Mouse tracking for 3D effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  // Format card number for display
  const formatCardNumber = (num: string) => {
    const cleaned = num.replace(/\s/g, "");
    return cleaned.match(/.{1,4}/g)?.join(" ") || num;
  };

  // Enhanced masking with animation
  const maskCardNumber = (num: string) => {
    const cleaned = num.replace(/\s/g, "");
    return `•••• •••• •••• ${cleaned.slice(-4)}`;
  };

  return (
    <div className="w-full max-w-[420px] group">
      {/* Card Container with Enhanced 3D Perspective */}
      <div
        ref={cardRef}
        className="relative w-full h-[260px] cursor-pointer group/card"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Card Flip Container */}
        <div
          className={`relative w-full h-full transition-all duration-700 ease-out`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped
              ? "rotateY(180deg)"
              : `rotateY(${isHovered ? '5deg' : '0deg'}) rotateX(${isHovered ? '5deg' : '0deg'})`,
            transformOrigin: isHovered ? `${mousePosition.x}px ${mousePosition.y}px` : 'center center',
            willChange: isHovered ? 'transform' : 'auto',
          }}
        >
          {/* FRONT OF CARD */}
          <div
            className={`absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
              isHovered ? `shadow-3xl ${tierConfig.shadow} scale-105` : 'shadow-2xl'
            }`}
            style={{
              backfaceVisibility: "hidden",
              transform: "translateZ(0.1px)", // Force hardware acceleration
              WebkitBackfaceVisibility: "hidden",
              WebkitTransform: "translateZ(0.1px)",
            }}
          >
            {/* Animated Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${tierConfig.gradient} transition-all duration-700`}>
              {/* Dynamic light effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent transition-all duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3) 0%, transparent 70%)`
                }}
              />
            </div>

            {/* Enhanced Decorative Elements */}
            <div className="absolute inset-0">
              {/* Animated wave pattern */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <svg viewBox="0 0 400 260" className="w-full h-full">
                  <defs>
                    <pattern id="wave" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                      <circle cx="25" cy="25" r="1" fill="white" opacity="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#wave)" />
                </svg>
              </div>

              {/* Geometric patterns */}
              <div className="absolute right-0 top-0 h-full w-[220px] bg-gradient-to-b from-white/5 via-white/2 to-transparent backdrop-blur-sm"
                   style={{ transform: "skewX(18deg) translateX(60px)" }} />
              <div className="absolute right-0 top-0 h-full w-[200px] bg-gradient-to-b from-white/3 via-transparent to-white/1 backdrop-blur-sm"
                   style={{ transform: "skewX(-12deg) translateX(60px)" }} />
            </div>

            {/* Bank Logo with Animation */}
            <div className="absolute top-6 right-6 transition-transform duration-300 group-hover/card:scale-110">
              <CreditCardIcon className={`w-10 h-10 ${tierConfig.textColor} opacity-80`} />
            </div>

            {/* Enhanced Tier Badge */}
            <div className="absolute top-6 left-6">
              <div className="flex items-center space-x-2">
                <p className={`text-xs font-medium ${tierConfig.textColor} opacity-80 uppercase tracking-[0.15em]`}>
                  Concierge Bank
                </p>
                <div className="w-1 h-1 bg-current opacity-50 rounded-full" />
              </div>
              <p className={`text-sm font-bold ${tierConfig.textColor} uppercase tracking-wider mt-1`}>
                {brand || tier}
              </p>
            </div>

            {/* Enhanced Chip */}
            <div className="absolute top-20 left-6 transition-transform duration-300 group-hover/card:scale-105">
              <div className={`relative w-12 h-10 rounded-md bg-gradient-to-br ${tierConfig.chipColor} overflow-hidden shadow-lg`}>
                {/* Chip circuit pattern */}
                <div className="absolute inset-0 opacity-60">
                  <div className="absolute w-full h-px bg-neutral-800/60 top-3" />
                  <div className="absolute w-full h-px bg-neutral-800/60 top-5" />
                  <div className="absolute w-full h-px bg-neutral-800/60 top-7" />
                  <div className="absolute w-px h-full bg-neutral-800/60 left-6" />
                  <div className="absolute w-px h-full bg-neutral-800/60 left-9" />
                </div>
                {/* Main chip */}
                <div className={`w-4 h-5 border border-neutral-800/70 rounded-sm bg-gradient-to-br from-neutral-300 to-neutral-500 z-10 absolute top-2 left-4 shadow-inner`} />
              </div>
            </div>

            {/* Enhanced Card Number */}
            <div className="absolute left-6 right-6 transition-all duration-300" style={{ top: "140px" }}>
              <p className={`text-2xl font-mono tracking-[0.15em] ${tierConfig.textColor} font-semibold transition-all duration-500 ${
                isFlipped ? 'blur-sm' : ''
              }`}>
                {isFlipped ? formatCardNumber(cardNumber) : maskCardNumber(cardNumber)}
              </p>
            </div>

            {/* Enhanced Expiry Date */}
            <div className="absolute left-6 transition-all duration-300" style={{ top: "165px" }}>
              <p className={`text-[10px] ${tierConfig.textColor} opacity-70 uppercase tracking-wide mb-1`}>
                Valid Thru
              </p>
              <p className={`text-sm font-mono ${tierConfig.textColor} font-medium`}>{expiryDate}</p>
            </div>

            {/* Enhanced Cardholder Name */}
            <div className="absolute left-6 transition-all duration-300" style={{ bottom: "20px" }}>
              <p className={`text-[10px] ${tierConfig.textColor} opacity-70 uppercase tracking-wide mb-1`}>
                Cardholder
              </p>
              <p className={`text-sm font-mono uppercase ${tierConfig.textColor} font-medium tracking-wider`}>
                {holder}
              </p>
            </div>

            {/* Enhanced Mastercard/Visa Logo */}
            <div className="absolute right-5 bottom-5 flex transition-transform duration-300 group-hover/card:scale-105">
              <div className="w-7 h-7 rounded-full bg-red-500 shadow-lg" />
              <div className="w-7 h-7 rounded-full bg-orange-400 -ml-3 shadow-lg" />
            </div>

            {/* Status Overlay with Animation */}
            {status === "locked" && (
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 to-red-800/60 backdrop-blur-sm flex items-center justify-center rounded-2xl transition-all duration-500">
                <div className="text-center animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-red-500/30 flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                    <svg className="w-6 h-6 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white font-bold text-sm tracking-wide">CARD LOCKED</p>
                  <p className="text-red-200 text-xs mt-1">Contact support to unlock</p>
                </div>
              </div>
            )}

            {status === "reported" && (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 to-orange-800/60 backdrop-blur-sm flex items-center justify-center rounded-2xl transition-all duration-500">
                <div className="text-center animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-orange-500/30 flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                    <svg className="w-6 h-6 text-orange-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white font-bold text-sm tracking-wide">ISSUE REPORTED</p>
                  <p className="text-orange-200 text-xs mt-1">Investigation in progress</p>
                </div>
              </div>
            )}

            {status === "blocked" && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/80 backdrop-blur-sm flex items-center justify-center rounded-2xl transition-all duration-500">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-500/30 flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                    <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white font-bold text-sm tracking-wide">CARD BLOCKED</p>
                  <p className="text-gray-300 text-xs mt-1">Permanently disabled</p>
                </div>
              </div>
            )}
          </div>

          {/* BACK OF CARD - Enhanced */}
          <div
            className={`absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${tierConfig.gradient}`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(0.1px)", // Force hardware acceleration
              WebkitBackfaceVisibility: "hidden",
              WebkitTransform: "rotateY(180deg) translateZ(0.1px)",
            }}
          >
            {/* Magnetic Strip */}
            <div className="absolute top-8 left-0 w-full h-12 bg-neutral-900 shadow-inner" />

            {/* Enhanced CVV Box */}
            <div className="absolute top-28 left-0 right-0 mx-6">
              <div className="bg-white rounded-lg p-4 shadow-lg border border-white/20">
                <label className="block text-[11px] text-neutral-600 uppercase tracking-wide mb-2 font-medium">
                  Security Code
                </label>
                <div className="flex items-center space-x-1">
                  {cvv.split('').map((char, i) => (
                    <div key={i} className="w-3 h-4 bg-neutral-900 rounded text-center flex items-center justify-center">
                      <span className="text-white text-xs font-mono">{char}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Terms */}
            <div className="absolute top-48 px-6 text-[10px] text-white/90 leading-relaxed">
              <p className="mb-2 font-medium">
                This card is property of Concierge Bank, Geneva. A Richemont financial institution.
              </p>
              <p className="opacity-80">Unauthorized use is prosecutable under Swiss banking law. Terms apply.</p>
            </div>

            {/* Holographic effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      {/* Enhanced Card Info Below */}
      {(balance !== undefined || creditLimit !== undefined) && (
        <div className="mt-6 glass rounded-2xl p-6 shadow-xl border border-gold-500/10 transition-all duration-300 hover:shadow-2xl hover:border-gold-500/20">
          <div className="grid grid-cols-2 gap-4">
            {balance !== undefined && (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-gray-400 uppercase tracking-wide">Balance</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  ${balance.toLocaleString()}
                </p>
              </div>
            )}
            {creditLimit !== undefined && (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm text-gray-400 uppercase tracking-wide">Credit Limit</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  ${creditLimit.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Progress bar for credit utilization */}
          {balance !== undefined && creditLimit !== undefined && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Credit Utilization</span>
                <span>{((balance / creditLimit) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((balance / creditLimit) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Click Hint */}
      <p className="text-center text-xs text-neutral-500 mt-4 opacity-70 hover:opacity-100 transition-opacity">
        Click to {isFlipped ? "hide" : "show"} details • Hover for 3D effect
      </p>
    </div>
  );
}
