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

/**
 * US-regulated trust-signal badges. Matches the regulatory surface a real
 * American bank + broker-dealer would disclose (FDIC, SIPC, OCC, Fed, PCI).
 */
export default function TrustBadges({ variant = "compact", className = "" }: TrustBadgesProps) {
	const badges: TrustBadge[] = [
		{ icon: <Building2 className="w-8 h-8 text-navy-700" />, title: "Member FDIC",            subtitle: "Deposits insured up to $250,000" },
		{ icon: <Shield    className="w-8 h-8 text-navy-700" />, title: "OCC Chartered",          subtitle: "Office of the Comptroller of the Currency" },
		{ icon: <Award     className="w-8 h-8 text-navy-700" />, title: "SIPC Member",            subtitle: "Brokerage accounts protected to $500,000" },
		{ icon: <Lock      className="w-8 h-8 text-navy-700" />, title: "GLBA Privacy",           subtitle: "Gramm-Leach-Bliley Act safeguards" },
		{ icon: <Globe     className="w-8 h-8 text-navy-700" />, title: "Basel III Compliant",    subtitle: "International capital standards" },
		{ icon: <CheckCircle2 className="w-8 h-8 text-navy-700" />, title: "PCI DSS Level 1",     subtitle: "Payment card security" },
	];

	const compactBadges: TrustBadge[] = [
		{ icon: <Building2    className="w-6 h-6 text-navy-700" />, title: "FDIC",     subtitle: "Insured" },
		{ icon: <Shield       className="w-6 h-6 text-navy-700" />, title: "OCC",      subtitle: "Chartered" },
		{ icon: <Award        className="w-6 h-6 text-navy-700" />, title: "SIPC",     subtitle: "Member" },
		{ icon: <Lock         className="w-6 h-6 text-navy-700" />, title: "GLBA",     subtitle: "Privacy" },
		{ icon: <Globe        className="w-6 h-6 text-navy-700" />, title: "Basel III", subtitle: "Compliant" },
	];

	const displayBadges = variant === "compact" ? compactBadges : badges;

	if (variant === "compact") {
		return (
			<div className={`flex flex-wrap justify-center gap-4 md:gap-6 ${className}`}>
				{displayBadges.map((badge, idx) => (
					<div key={idx} className="flex flex-col items-center space-y-1 min-w-[80px]">
						<div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center">
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
					className="flex flex-col items-center text-center p-6 bg-white/60 backdrop-blur-sm border border-navy-200/40 rounded-xl hover:border-navy-400/60 transition-all duration-300"
				>
					<div className="w-16 h-16 rounded-full bg-navy-50 flex items-center justify-center mb-4">
						{badge.icon}
					</div>
					<h4 className="text-sm font-medium text-neutral-800 mb-1">{badge.title}</h4>
					<p className="text-xs text-neutral-500">{badge.subtitle}</p>
				</div>
			))}
		</div>
	);
}
