"use client";

import { useState } from "react";
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

  // Get tier-specific gradient
  const getTierGradient = () => {
    switch (tier) {
      case "Gold":
        return "from-[#D08C1D] via-[#EBA420] to-[#F2CA27]";
      case "Platinum":
        return "from-slate-600 via-slate-500 to-slate-400";
      case "Black":
        return "from-neutral-900 via-neutral-800 to-neutral-700";
      default:
        return "from-[#D08C1D] via-[#EBA420] to-[#F2CA27]";
    }
  };

  // Get accent color for tier
  const getAccentColor = () => {
    switch (tier) {
      case "Gold":
        return "#F2CA27";
      case "Platinum":
        return "#cbd5e1";
      case "Black":
        return "#F2CA27";
      default:
        return "#F2CA27";
    }
  };

  // Format card number for display
  const formatCardNumber = (num: string) => {
    const cleaned = num.replace(/\s/g, "");
    return cleaned.match(/.{1,4}/g)?.join(" ") || num;
  };

  // Mask card number (show last 4)
  const maskCardNumber = (num: string) => {
    const cleaned = num.replace(/\s/g, "");
    return `•••• •••• •••• ${cleaned.slice(-4)}`;
  };

  return (
    <div className="w-full max-w-[400px]">
      {/* Card Container with 3D Perspective */}
      <div
        className="relative w-full h-[250px] cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Flip Container */}
        <div
          className={`relative w-full h-full`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* FRONT OF CARD */}
          <div
            className={`absolute w-full h-full rounded-2xl shadow-2xl overflow-hidden`}
            style={{
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getTierGradient()}`} />

            {/* Decorative Strips */}
            <div
              className="absolute right-0 top-0 h-full w-[200px] bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm"
              style={{ transform: "skewX(20deg) translateX(50px)" }}
            />
            <div
              className="absolute right-0 top-0 h-full w-[180px] bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-sm"
              style={{ transform: "skewX(-15deg) translateX(50px)" }}
            />

            {/* Bank Logo */}
            <div className="absolute top-6 right-6">
              <CreditCardIcon className="w-10 h-10 text-white opacity-80" />
            </div>

            {/* Tier Badge */}
            <div className="absolute top-6 left-6">
              <p className="text-xs font-medium text-white/80 uppercase tracking-[0.15em] mb-0.5">
                Concierge Bank
              </p>
              <p className="text-sm font-semibold text-white uppercase tracking-wider">
                {brand || tier}
              </p>
            </div>

            {/* Chip */}
            <div className="absolute top-20 left-6">
              <div className="relative w-12 h-10 rounded-md bg-gradient-to-br from-[#ffecc7] to-[#d0b978] overflow-hidden flex items-center justify-center shadow-md">
                {/* Chip lines */}
                <div className="absolute w-full h-px bg-neutral-800/40" style={{ top: "13px" }} />
                <div className="absolute w-full h-px bg-neutral-800/40" style={{ top: "20px" }} />
                <div className="absolute w-full h-px bg-neutral-800/40" style={{ top: "28px" }} />
                <div
                  className="absolute w-px h-full bg-neutral-800/40"
                  style={{ left: "24px" }}
                />
                {/* Chip main */}
                <div className="w-5 h-6 border border-neutral-800/50 rounded-sm bg-gradient-to-br from-[#efdbab] to-[#e1cb94] z-10" />
              </div>
            </div>

            {/* Wave Icon */}
            <div className="absolute top-24 left-24 opacity-30">
              <svg
                viewBox="0 3.71 26.959 38.787"
                width="26"
                height="38"
                fill="white"
                className="opacity-50"
              >
                <path d="M19.709 3.719c.266.043.5.187.656.406 4.125 5.207 6.594 11.781 6.594 18.938 0 7.156-2.469 13.73-6.594 18.937-.195.336-.57.531-.957.492a.9946.9946 0 0 1-.851-.66c-.129-.367-.035-.777.246-1.051 3.855-4.867 6.156-11.023 6.156-17.718 0-6.696-2.301-12.852-6.156-17.719-.262-.317-.301-.762-.102-1.121.204-.36.602-.559 1.008-.504z" />
              </svg>
            </div>

            {/* Card Number */}
            <div className="absolute left-6 right-6" style={{ top: "135px" }}>
              <p className="text-2xl font-mono tracking-[0.2em] text-white font-medium">
                {isFlipped ? formatCardNumber(cardNumber) : maskCardNumber(cardNumber)}
              </p>
            </div>

            {/* Expiry Date */}
            <div className="absolute left-6" style={{ top: "180px" }}>
              <p className="text-[9px] text-white/70 uppercase tracking-wide mb-1">
                Exp. End:
              </p>
              <p className="text-sm font-mono text-white/90">{expiryDate}</p>
            </div>

            {/* Cardholder Name */}
            <div className="absolute left-6 bottom-6">
              <p className="text-sm font-mono uppercase text-white/90 tracking-wide">
                {holder}
              </p>
            </div>

            {/* Mastercard/Visa Logo */}
            <div className="absolute right-5 bottom-5 flex">
              <div className="w-7 h-7 rounded-full bg-[#eb001b]" />
              <div className="w-7 h-7 rounded-full bg-[#f79e1b]/70 -ml-3" />
            </div>

            {/* Locked Overlay */}
            {status === "locked" && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-white font-semibold">Card Locked</p>
                </div>
              </div>
            )}
          </div>

          {/* BACK OF CARD */}
          <div
            className={`absolute w-full h-full rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br ${getTierGradient()}`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(0)",
            }}
          >
            {/* Magnetic Strip */}
            <div className="absolute top-8 left-0 w-full h-12 bg-neutral-900" />

            {/* CVV Box */}
            <div className="absolute top-28 left-0 right-0 mx-6">
              <div className="bg-white rounded-lg p-3 text-right">
                <label className="block text-[10px] text-neutral-600 uppercase tracking-wide mb-2 text-left">
                  CVV
                </label>
                <p className="text-lg font-mono text-neutral-900 tracking-widest">{cvv}</p>
              </div>
            </div>

            {/* Terms */}
            <div className="absolute top-48 px-6 text-[10px] text-white/80 leading-relaxed">
              <p className="mb-2">
                Property of Concierge Bank, Geneva. A Richemont financial institution. Unauthorized use is prosecutable under Swiss banking law.
              </p>
              <p>Acceptance subject to Maison membership terms and cardholder agreement.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Info Below */}
      {(balance !== undefined || creditLimit !== undefined) && (
        <div className="mt-4 glass rounded-xl p-4 shadow-md transition-smooth hover-lift">
          {balance !== undefined && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Balance</span>
              <span className="font-semibold text-neutral-900">
                ${balance.toLocaleString()}
              </span>
            </div>
          )}
          {creditLimit !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Credit Limit</span>
              <span className="font-semibold text-neutral-900">
                ${creditLimit.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Click Hint */}
      <p className="text-center text-xs text-neutral-500 mt-3">
        Click card to {isFlipped ? "hide" : "show"} details
      </p>
    </div>
  );
}
