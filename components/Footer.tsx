"use client";

/**
 * InvBank footer — modeled on USAA/Chase/BofA compliance patterns.
 *
 * Includes, top to bottom:
 *   1. FDIC / Member FDIC / Equal Housing Lender seals
 *   2. 4-column product / about / legal / support link grid (Apex reference)
 *   3. Socials
 *   4. Non-deposit investment products disclaimer ("Not FDIC insured / May lose value / No bank guarantee")
 *   5. Truth-in-Savings, Truth-in-Lending, Reg E (EFTA), Reg CC, CFPB, OCC disclosures
 *   6. GLBA / privacy / Do-Not-Sell, USA PATRIOT Act Section 326 notice
 *   7. ADA / WCAG accessibility statement
 *   8. Copyright + NMLS ID + routing number
 */

import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube, Phone, Mail, MapPin } from "lucide-react";

// ─── Link columns ─────────────────────────────────────────────────────────
const columns = [
	{
		title: "Products",
		links: [
			{ label: "Credit Cards", href: "/#cards" },
			{ label: "Checking & Savings", href: "/dashboard/accounts" },
			{ label: "Auto Loans", href: "/#lending" },
			{ label: "Home Lending", href: "/#lending" },
			{ label: "Business", href: "/#business" },
			{ label: "Wealth Management", href: "/wealth-management" },
			{ label: "Investment Trading", href: "/dashboard/trade" },
		],
	},
	{
		title: "About Us",
		links: [
			{ label: "Our Story", href: "/about" },
			{ label: "Corporate Information", href: "/about" },
			{ label: "Newsroom", href: "/about" },
			{ label: "Technology", href: "/about" },
			{ label: "Investors", href: "/about" },
			{ label: "Careers", href: "/about" },
			{ label: "Diversity & Inclusion", href: "/about" },
		],
	},
	{
		title: "Legal",
		links: [
			{ label: "Privacy Notice (GLBA)", href: "/privacy" },
			{ label: "Do Not Sell My Info (CCPA)", href: "/privacy" },
			{ label: "Security", href: "/security" },
			{ label: "Terms of Use", href: "/terms" },
			{ label: "Disclosures", href: "/terms" },
			{ label: "Accessibility (ADA)", href: "/about" },
			{ label: "Regulatory Affairs", href: "/security" },
		],
	},
	{
		title: "Support",
		links: [
			{ label: "Help Center", href: "/security" },
			{ label: "Contact Us", href: "/about" },
			{ label: "Locations & ATMs", href: "/about" },
			{ label: "Fraud Protection", href: "/security" },
			{ label: "Report a Lost Card", href: "/dashboard/cards" },
			{ label: "Report Phishing", href: "/security" },
		],
	},
];

const socials = [
	{ label: "Facebook", href: "https://www.facebook.com/invbank", icon: <Facebook size={16} /> },
	{ label: "X", href: "https://twitter.com/invbank", icon: <Twitter size={16} /> },
	{ label: "LinkedIn", href: "https://www.linkedin.com/company/invbank", icon: <Linkedin size={16} /> },
	{ label: "YouTube", href: "https://www.youtube.com/@invbank", icon: <Youtube size={16} /> },
];

// ─── Official-looking regulatory seals (inline SVG, no external deps) ─────
function FdicSeal() {
	return (
		<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/20 bg-white/5">
			<svg viewBox="0 0 40 40" className="w-6 h-6" aria-hidden>
				<circle cx="20" cy="20" r="18" fill="#C9B074" />
				<circle cx="20" cy="20" r="14" fill="none" stroke="#111E38" strokeWidth="1" />
				<text x="20" y="17" textAnchor="middle" fontSize="6" fontWeight="900" fill="#111E38" fontFamily="sans-serif">FDIC</text>
				<text x="20" y="25" textAnchor="middle" fontSize="3" fontWeight="700" fill="#111E38" fontFamily="sans-serif">INSURED</text>
			</svg>
			<div className="flex flex-col leading-tight">
				<span className="text-[10px] font-bold text-white uppercase tracking-wide">Member FDIC</span>
				<span className="text-[9px] text-neutral-400">Up to $250,000</span>
			</div>
		</div>
	);
}

function EqualHousingSeal() {
	return (
		<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/20 bg-white/5">
			<svg viewBox="0 0 40 40" className="w-6 h-6" aria-hidden>
				<rect x="2" y="2" width="36" height="36" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
				<path d="M20 8 L32 18 L28 18 L28 30 L22 30 L22 22 L18 22 L18 30 L12 30 L12 18 L8 18 Z" fill="#FFFFFF" />
				<rect x="15" y="25" width="2" height="2" fill="#111E38" />
				<rect x="23" y="25" width="2" height="2" fill="#111E38" />
			</svg>
			<div className="flex flex-col leading-tight">
				<span className="text-[10px] font-bold text-white uppercase tracking-wide">Equal Housing</span>
				<span className="text-[9px] text-neutral-400">Lender</span>
			</div>
		</div>
	);
}

function SipcSeal() {
	return (
		<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/20 bg-white/5">
			<svg viewBox="0 0 40 40" className="w-6 h-6" aria-hidden>
				<circle cx="20" cy="20" r="18" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
				<text x="20" y="23" textAnchor="middle" fontSize="8" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif">SIPC</text>
			</svg>
			<div className="flex flex-col leading-tight">
				<span className="text-[10px] font-bold text-white uppercase tracking-wide">SIPC Member</span>
				<span className="text-[9px] text-neutral-400">Securities Investor</span>
			</div>
		</div>
	);
}

export default function Footer() {
	return (
		<footer
			className="relative bg-navy-950 text-navy-200"
			role="contentinfo"
			aria-label="Site footer"
		>
			{/* ─── Regulatory trust bar ─── */}
			<div className="border-b border-white/5 py-6">
				<div className="container mx-auto px-6 sm:px-8 flex flex-wrap items-center justify-center gap-3">
					<FdicSeal />
					<EqualHousingSeal />
					<SipcSeal />
					<span className="text-[10px] text-neutral-500 tracking-wide uppercase">
						FDIC-Insured — Backed by the full faith and credit of the U.S. Government
					</span>
				</div>
			</div>

			{/* ─── Columns ─── */}
			<div className="container mx-auto px-6 sm:px-8 py-14">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
					{columns.map((col) => (
						<div key={col.title}>
							<h4 className="text-sm font-work-sans font-bold text-white mb-5">
								{col.title}
							</h4>
							<ul className="space-y-2.5">
								{col.links.map((l) => (
									<li key={l.label}>
										<Link
											href={l.href}
											className="text-sm font-gruppo text-neutral-400 hover:text-white transition-colors"
										>
											{l.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* ─── Brand + contact + socials row ─── */}
				<div className="mt-12 pt-8 border-t border-white/10 grid gap-6 md:grid-cols-3">
					{/* Brand */}
					<Link href="/" className="flex items-center gap-2.5">
						<svg viewBox="0 0 40 40" className="w-8 h-8" aria-hidden>
							<path d="M20 4 L36 32 L28 32 L20 18 L12 32 L4 32 Z" fill="#FFFFFF" />
							<path d="M20 18 L28 32 L12 32 Z" fill="#BDCBE1" />
						</svg>
						<span className="font-work-sans font-extrabold text-white text-lg">
							Inv<span className="text-navy-200">Bank</span>
						</span>
					</Link>

					{/* Contact */}
					<div className="space-y-2 text-xs text-neutral-400 font-gruppo">
						<a href="tel:+18004682265" className="flex items-center gap-2 hover:text-white transition-colors">
							<Phone size={12} />
							<span>1-800-INVBANK (1-800-468-2265)</span>
						</a>
						<a href="mailto:contact@invbank.us" className="flex items-center gap-2 hover:text-white transition-colors">
							<Mail size={12} />
							<span>contact@invbank.us</span>
						</a>
						<div className="flex items-start gap-2">
							<MapPin size={12} className="mt-0.5 flex-shrink-0" />
							<span>
								InvBank, N.A.
								<br />
								One Financial Plaza, New York, NY 10005
							</span>
						</div>
					</div>

					{/* Socials */}
					<div className="flex items-center gap-3 md:justify-end">
						{socials.map((s) => (
							<a
								key={s.label}
								href={s.href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={s.label}
								className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
							>
								{s.icon}
							</a>
						))}
					</div>
				</div>

				{/* ─── Non-deposit investment products disclaimer (required by FRB/OCC joint guidance) ─── */}
				<div className="mt-10 p-5 rounded-lg border border-white/10 bg-white/5">
					<p className="text-[10px] font-bold tracking-widest uppercase text-neutral-300 mb-2">
						Investment & Insurance Products:
					</p>
					<div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] font-gruppo text-neutral-300">
						<span>• Are <strong className="text-white">NOT</strong> FDIC Insured</span>
						<span>• Are <strong className="text-white">NOT</strong> Insured by Any Federal Government Agency</span>
						<span>• Are <strong className="text-white">NOT</strong> Deposits</span>
						<span>• Are <strong className="text-white">NOT</strong> Guaranteed by InvBank or any Bank Affiliate</span>
						<span>• <strong className="text-white">MAY LOSE VALUE</strong></span>
					</div>
				</div>

				{/* ─── Full legal footnotes (USAA-style) ─── */}
				<div className="mt-10 space-y-4 text-[11px] font-gruppo text-neutral-500 leading-relaxed">
					<p className="text-neutral-400 text-xs font-bold uppercase tracking-widest">
						Footnotes & Disclosures
					</p>

					<p>
						<strong className="text-neutral-300">FDIC Insurance.</strong> InvBank is a
						Member of the Federal Deposit Insurance Corporation (FDIC). Deposits are
						insured up to the maximum amount permitted by law — $250,000 per depositor,
						per insured bank, for each account ownership category. For more information
						on FDIC insurance, visit{" "}
						<a
							href="https://www.fdic.gov/resources/deposit-insurance/"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-neutral-300"
						>
							fdic.gov
						</a>
						.
					</p>

					<p>
						<strong className="text-neutral-300">Non-Deposit Investment Products.</strong>{" "}
						Securities, brokerage, advisory, insurance, and annuity products offered
						through InvBank Wealth Management, LLC — a wholly owned subsidiary of InvBank,
						N.A. and a SIPC member broker-dealer (member{" "}
						<a href="https://www.finra.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-300">FINRA</a>
						/
						<a href="https://www.sipc.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-300">SIPC</a>
						). Investment products are not bank deposits, are not obligations of, or
						guaranteed by, InvBank, and are not insured by the FDIC or any federal
						government agency. <strong className="text-neutral-300">Investing involves risk, including possible loss of principal.</strong>
					</p>

					<p>
						<strong className="text-neutral-300">Truth-in-Savings (Reg DD) &amp; Truth-in-Lending (Reg Z).</strong>{" "}
						Annual Percentage Yields (APYs) on deposit accounts and Annual Percentage
						Rates (APRs) on credit products are accurate as of the date of publication
						and may change without notice. Fees may reduce earnings. See account
						agreement and Schedule of Fees for full terms.
					</p>

					<p>
						<strong className="text-neutral-300">Electronic Fund Transfers (Reg E).</strong>{" "}
						Your rights and InvBank&apos;s responsibilities for electronic fund transfers,
						including debit card transactions, ACH, and bill pay, are governed by the
						Electronic Fund Transfer Act and Regulation E. If you believe an
						unauthorized transfer has occurred, notify us at 1-800-INVBANK within 60
						days of the statement date.
					</p>

					<p>
						<strong className="text-neutral-300">Funds Availability (Reg CC).</strong>{" "}
						Our policy is to make deposited funds available to you in accordance with
						the Expedited Funds Availability Act and Regulation CC. Certain deposits
						may have longer holds; see our Funds Availability Policy disclosure.
					</p>

					<p>
						<strong className="text-neutral-300">USA PATRIOT Act — Section 326 Customer Identification.</strong>{" "}
						Federal law requires all financial institutions to obtain, verify, and
						record information identifying each person who opens an account. When you
						open an account, we will ask for your name, address, date of birth, and
						other information that will allow us to identify you. We may also ask to
						see your driver&apos;s license or other identifying documents.
					</p>

					<p>
						<strong className="text-neutral-300">Privacy (GLBA).</strong> Under the
						Gramm-Leach-Bliley Act, InvBank is required to inform you of our privacy
						practices. Read our full{" "}
						<Link href="/privacy" className="underline hover:text-neutral-300">Privacy Notice</Link>{" "}
						to learn how we collect, share, and protect your personal information, and
						your right to limit sharing.
					</p>

					<p>
						<strong className="text-neutral-300">California Residents (CCPA/CPRA).</strong>{" "}
						California residents have the right to know what personal information we
						collect, to request deletion, and to opt out of sale or sharing. Use{" "}
						<Link href="/privacy" className="underline hover:text-neutral-300">Do Not Sell or Share My Personal Information</Link>.
					</p>

					<p>
						<strong className="text-neutral-300">Fair Lending &amp; Equal Credit Opportunity (Reg B).</strong>{" "}
						InvBank is an Equal Housing Lender. We do not discriminate on the basis of
						race, color, religion, national origin, sex, marital status, age, receipt
						of public assistance, or the good-faith exercise of any right under the
						Consumer Credit Protection Act. Credit products are subject to approval and
						program terms; rates and fees may vary based on creditworthiness.
					</p>

					<p>
						<strong className="text-neutral-300">Regulatory Oversight.</strong> InvBank,
						N.A. is a national bank chartered and supervised by the Office of the
						Comptroller of the Currency (
						<a href="https://www.occ.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-300">OCC</a>
						) and is subject to examination by the Consumer Financial Protection Bureau
						(
						<a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-300">CFPB</a>
						). To file a complaint, visit{" "}
						<a href="https://www.consumerfinance.gov/complaint/" target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-300">
							consumerfinance.gov/complaint
						</a>
						.
					</p>

					<p>
						<strong className="text-neutral-300">Accessibility (ADA / WCAG 2.1 AA).</strong>{" "}
						InvBank is committed to providing an accessible experience for all customers,
						including individuals with disabilities. If you have difficulty accessing any
						feature of our site, please call 1-800-INVBANK or email{" "}
						<a href="mailto:accessibility@invbank.us" className="underline hover:text-neutral-300">
							accessibility@invbank.us
						</a>
						.
					</p>

					<p>
						<strong className="text-neutral-300">Market Data.</strong> Quotes and
						charts on <Link href="/dashboard/trade" className="underline hover:text-neutral-300">Trade</Link> are provided by third-party sources and may be
						delayed. Nothing on this site constitutes an offer, solicitation, or
						recommendation to buy or sell any security. Past performance is not
						indicative of future results.
					</p>

					<p>
						<strong className="text-neutral-300">Third-Party Links.</strong> Links to
						non-InvBank websites are provided for convenience only. InvBank does not
						endorse and is not responsible for the content, products, or services on
						third-party sites.
					</p>
				</div>

				{/* ─── Copyright bar ─── */}
				<div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-neutral-500 font-gruppo">
					<p>
						&copy; {new Date().getFullYear()} InvBank, N.A. All rights reserved.
						Routing # 021000089 · NMLS ID # 1234567 · Member FDIC · Equal Housing Lender.
					</p>
					<div className="flex items-center gap-4">
						<Link href="/privacy" className="hover:text-neutral-300 transition-colors">Privacy</Link>
						<span>·</span>
						<Link href="/terms" className="hover:text-neutral-300 transition-colors">Terms</Link>
						<span>·</span>
						<Link href="/security" className="hover:text-neutral-300 transition-colors">Security</Link>
						<span>·</span>
						<Link href="/about" className="hover:text-neutral-300 transition-colors">Accessibility</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
