"use client";

import { Shield, Lock, Award, Building2, Globe, CheckCircle2 } from "lucide-react";

interface TrustBadge {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

interface TrustBadgesProps {
  variant?: "compact" | "detailed";
  className?: string;
}

export default function TrustBadges({ variant = "compact", className = "" }: TrustBadgesProps) {
  const badges: TrustBadge[] = [
    {
      icon: <Shield className="w-8 h-8 text-gold-600" />,
      title: "FINMA Regulated",
      subtitle: "Swiss Financial Market Supervisory Authority"
    },
    {
      icon: <Building2 className="w-8 h-8 text-gold-600" />,
      title: "FDIC Coverage",
      subtitle: "US Deposit Insurance Protection"
    },
    {
      icon: <Award className="w-8 h-8 text-gold-600" />,
      title: "Richemont Group",
      subtitle: "Compagnie Financière Richemont SA"
    },
    {
      icon: <Lock className="w-8 h-8 text-gold-600" />,
      title: "Swiss Banking Secrecy",
      subtitle: "Federal Data Protection Act"
    },
    {
      icon: <Globe className="w-8 h-8 text-gold-600" />,
      title: "Basel III Compliant",
      subtitle: "International Banking Standards"
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-gold-600" />,
      title: "PCI DSS Level 1",
      subtitle: "Payment Card Security Standards"
    }
  ];

  const compactBadges: TrustBadge[] = [
    {
      icon: <Shield className="w-6 h-6 text-gold-600" />,
      title: "FINMA",
      subtitle: "Regulated"
    },
    {
      icon: <Building2 className="w-6 h-6 text-gold-600" />,
      title: "FDIC",
      subtitle: "Insured"
    },
    {
      icon: <Award className="w-6 h-6 text-gold-600" />,
      title: "Richemont",
      subtitle: "Group"
    },
    {
      icon: <Lock className="w-6 h-6 text-gold-600" />,
      title: "Swiss",
      subtitle: "Privacy"
    },
    {
      icon: <Globe className="w-6 h-6 text-gold-600" />,
      title: "Basel III",
      subtitle: "Compliant"
    }
  ];

  const displayBadges = variant === "compact" ? compactBadges : badges;

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap justify-center gap-4 md:gap-6 ${className}`}>
        {displayBadges.map((badge, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center space-y-1 min-w-[80px]"
          >
            <div className="w-12 h-12 rounded-full bg-gold-50 flex items-center justify-center">
              {badge.icon}
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-neutral-800">{badge.title}</p>
              <p className="text-[10px] text-neutral-500">{badge.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-6 ${className}`}>
      {displayBadges.map((badge, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center text-center p-6 bg-white/60 backdrop-blur-sm border border-gold-200/40 rounded-xl hover:border-gold-400/60 transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-gold-50 flex items-center justify-center mb-4">
            {badge.icon}
          </div>
          <h4 className="text-sm font-medium text-neutral-800 mb-1">
            {badge.title}
          </h4>
          <p className="text-xs text-neutral-500">
            {badge.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}
