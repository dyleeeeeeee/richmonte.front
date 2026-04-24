"use client";

/**
 * AuthShell — shared chrome for /login and /register.
 *
 * Left column: hero (navy background, image overlay, tagline) — matches the
 *   Apex/USAA style of flanking the auth form with a branded "value prop" panel.
 * Right column: the form (children), headed by the InvBank SVG logomark.
 *
 * Pure presentational — no auth logic here.
 */

import Link from "next/link";
import { ShieldCheck, Lock, Award } from "lucide-react";

export function InvBankLogo({ size = 32 }: { size?: number }) {
	return (
		<svg viewBox="0 0 40 40" width={size} height={size} aria-hidden>
			<path d="M20 4 L36 32 L28 32 L20 18 L12 32 L4 32 Z" fill="#2C3E5A" />
			<path d="M20 18 L28 32 L12 32 Z" fill="#354A68" />
		</svg>
	);
}

export default function AuthShell({
	title,
	subtitle,
	children,
	footer,
}: {
	title: string;
	subtitle: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
}) {
	return (
		<div className="min-h-screen grid lg:grid-cols-2 bg-light-100">
			{/* ── Left: branded hero (hidden on small screens) ── */}
			<aside
				className="relative hidden lg:flex flex-col justify-between p-10 text-white overflow-hidden"
				style={{
					backgroundImage:
						"linear-gradient(130deg, rgba(23,34,58,0.92) 0%, rgba(44,62,90,0.78) 55%, rgba(53,74,104,0.45) 100%), url('https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=1400&q=80')",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<Link href="/" className="flex items-center gap-2.5 group w-fit">
					<InvBankLogo size={36} />
					<span className="font-work-sans text-xl font-extrabold tracking-tight">
						Inv<span className="text-navy-200">Bank</span>
					</span>
				</Link>

				<div className="max-w-md">
					<h2 className="font-work-sans text-4xl font-extrabold leading-tight tracking-tight">
						Banking Built for
						<br />
						Your Ambition.
					</h2>
					<p className="mt-4 text-sm text-navy-100/90 font-gruppo leading-relaxed">
						Zero monthly fees. Real-time alerts. Instant transfers. Commission-free investing.
						FDIC-insured to $250,000.
					</p>

					<ul className="mt-8 space-y-3 text-sm font-gruppo">
						<li className="flex items-center gap-3">
							<ShieldCheck size={16} className="text-navy-200" />
							<span>FDIC-Insured · Member FDIC · Equal Housing Lender</span>
						</li>
						<li className="flex items-center gap-3">
							<Lock size={16} className="text-navy-200" />
							<span>Bank-grade encryption · 2FA · fraud monitoring</span>
						</li>
						<li className="flex items-center gap-3">
							<Award size={16} className="text-navy-200" />
							<span>SIPC-member brokerage for investment accounts</span>
						</li>
					</ul>
				</div>

				<p className="text-[10px] text-navy-100/60 tracking-widest uppercase">
					© {new Date().getFullYear()} InvBank, N.A. · Member FDIC
				</p>
			</aside>

			{/* ── Right: form column ── */}
			<main className="flex items-start lg:items-center justify-center px-4 sm:px-8 py-10 lg:py-16">
				<div className="w-full max-w-md">
					{/* Mobile-only brand row (shows instead of the left panel on <lg) */}
					<Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
						<InvBankLogo size={28} />
						<span className="font-work-sans text-lg font-extrabold text-navy-900">
							Inv<span className="text-navy-700">Bank</span>
						</span>
					</Link>

					<div className="mb-7">
						<h1 className="font-work-sans text-3xl font-extrabold text-navy-900 tracking-tight">
							{title}
						</h1>
						<p className="text-sm text-neutral-600 font-gruppo mt-1.5">{subtitle}</p>
					</div>

					<div className="bg-white rounded-2xl border border-light-300 p-7 sm:p-8 shadow-sm">
						{children}
					</div>

					{footer ? <div className="mt-6 text-center text-xs text-neutral-500 font-gruppo">{footer}</div> : null}
				</div>
			</main>
		</div>
	);
}
