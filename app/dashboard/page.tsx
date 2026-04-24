"use client";

/**
 * InvBank dashboard — bento layout.
 *
 * Design goals:
 *  - Modular 12-col grid. Desktop mixes 8/4, 5/4/3, 7/5, 8/4 row shapes.
 *  - Navy / stone / white palette. No gold dominance (legacy Concierge tone is gone).
 *  - Every tile shares a single `BentoTile` primitive so spacing, borders,
 *    and hover behaviour stay consistent.
 *  - Data comes from the existing `accountAPI` / `cardAPI` / `billAPI` stack
 *    which already routes through mock mode when offline.
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
	Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
	ArrowUpRight, ArrowDownLeft, CreditCard as CardIcon, Send, Plus, TrendingUp,
	ShoppingBag, Utensils, Zap, Plane, RefreshCw, DollarSign,
	ChevronRight, Clock, BarChart2, Eye, EyeOff, Receipt, FileText,
	Wallet, ArrowRight, Sparkles,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import {
	accountAPI, cardAPI, billAPI, tradeAPI,
	type Account, type Transaction, type Bill,
} from "@/lib/api";
import { useLiveQuotes } from "./trade/_module/services/marketService";

// ══════════════════════════════════════════════════════════════════════════
// Constants + helpers
// ══════════════════════════════════════════════════════════════════════════

const RATES: { label: string; value: string; delta: string }[] = [
	{ label: "Prime Rate",      value: "8.50%",       delta: "+0.00" },
	{ label: "30Y Fixed",       value: "6.82%",       delta: "-0.03" },
	{ label: "10Y Treasury",    value: "4.41%",       delta: "+0.02" },
	{ label: "Fed Funds",       value: "5.25–5.50%",  delta: "+0.00" },
	{ label: "1Y CD APY",       value: "4.95%",       delta: "+0.05" },
];

type CategoryMeta = { icon: React.ReactNode; color: string; bg: string };
const CATEGORY_META: Record<string, CategoryMeta> = {
	Income:         { icon: <DollarSign size={16} />,   color: "text-emerald-600", bg: "bg-emerald-50" },
	Transfer:       { icon: <RefreshCw size={16} />,    color: "text-blue-600",    bg: "bg-blue-50" },
	Bills:          { icon: <Receipt size={16} />,      color: "text-amber-600",   bg: "bg-amber-50" },
	Utilities:      { icon: <Zap size={16} />,          color: "text-amber-600",   bg: "bg-amber-50" },
	Shopping:       { icon: <ShoppingBag size={16} />,  color: "text-purple-600",  bg: "bg-purple-50" },
	Dining:         { icon: <Utensils size={16} />,     color: "text-orange-600",  bg: "bg-orange-50" },
	Travel:         { icon: <Plane size={16} />,        color: "text-sky-600",     bg: "bg-sky-50" },
	Groceries:      { icon: <ShoppingBag size={16} />,  color: "text-green-600",   bg: "bg-green-50" },
	Subscriptions:  { icon: <BarChart2 size={16} />,    color: "text-pink-600",    bg: "bg-pink-50" },
	Deposit:        { icon: <ArrowDownLeft size={16} />, color: "text-emerald-600", bg: "bg-emerald-50" },
	Investing:      { icon: <TrendingUp size={16} />,   color: "text-navy-700",    bg: "bg-navy-50" },
	Interest:       { icon: <Sparkles size={16} />,     color: "text-emerald-600", bg: "bg-emerald-50" },
};

function categoryMeta(tx: Pick<Transaction, "category" | "type">): CategoryMeta {
	if (tx.category && CATEGORY_META[tx.category]) return CATEGORY_META[tx.category];
	return tx.type === "credit"
		? { icon: <ArrowDownLeft size={16} />, color: "text-emerald-600", bg: "bg-emerald-50" }
		: { icon: <ArrowUpRight size={16} />,  color: "text-red-600",     bg: "bg-red-50" };
}

function greeting(): string {
	const h = new Date().getHours();
	if (h < 12) return "Good morning";
	if (h < 17) return "Good afternoon";
	return "Good evening";
}

function fmtMoney(n: number, opts: { hide?: boolean; compact?: boolean } = {}): string {
	if (opts.hide) return "••••••";
	return n.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: opts.compact ? 0 : 2,
		maximumFractionDigits: opts.compact ? 0 : 2,
	});
}

function daysUntil(iso: string): number {
	return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

/** Build a synthetic 30-day balance trend from transactions by subtracting
 *  each day's net from today's total. Good enough for a sparkline — no fake
 *  numbers, it reflects the user's actual cash flow. */
function buildTrend(total: number, txs: Transaction[]): { day: number; value: number }[] {
	const series: { day: number; value: number }[] = [];
	let running = total;
	const byDay = new Map<string, number>();
	for (const t of txs) {
		const d = new Date(t.created_at).toISOString().slice(0, 10);
		byDay.set(d, (byDay.get(d) || 0) + (t.type === "credit" ? t.amount : -t.amount));
	}
	for (let i = 0; i < 30; i++) {
		const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
		series.unshift({ day: 30 - i, value: running });
		running -= byDay.get(d) || 0;
	}
	return series;
}

// ══════════════════════════════════════════════════════════════════════════
// Primitives
// ══════════════════════════════════════════════════════════════════════════

interface BentoTileProps {
	children: React.ReactNode;
	className?: string;
	href?: string;
	onClick?: () => void;
	tone?: "light" | "dark";
	padding?: "default" | "tight" | "none";
}

function BentoTile({
	children,
	className = "",
	href,
	onClick,
	tone = "light",
	padding = "default",
}: BentoTileProps) {
	const router = useRouter();
	const interactive = !!(href || onClick);
	const handleClick = () => {
		if (onClick) return onClick();
		if (href) return router.push(href);
	};

	const base =
		tone === "dark"
			? "bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white border-navy-800"
			: "bg-white text-neutral-900 border-light-300/80";
	const pad = padding === "none" ? "" : padding === "tight" ? "p-4" : "p-5 sm:p-6";
	const hover = interactive
		? "cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-navy-700/40"
		: "";

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
			onClick={interactive ? handleClick : undefined}
			className={`relative rounded-2xl border shadow-sm overflow-hidden ${base} ${pad} ${hover} ${className}`}
		>
			{children}
		</motion.div>
	);
}

function TileHeader({ title, subtitle, action }: {
	title: string;
	subtitle?: string;
	action?: React.ReactNode;
}) {
	return (
		<div className="flex items-start justify-between mb-4">
			<div>
				<h3 className="text-[11px] font-work-sans font-bold tracking-[0.12em] uppercase text-neutral-500">
					{title}
				</h3>
				{subtitle && (
					<p className="text-xs text-neutral-400 mt-0.5 font-gruppo">{subtitle}</p>
				)}
			</div>
			{action}
		</div>
	);
}

// ══════════════════════════════════════════════════════════════════════════
// Tiles
// ══════════════════════════════════════════════════════════════════════════

// ── 1. Net-worth hero ──────────────────────────────────────────────────────
function BalanceTile({ total, trend, hide, onToggleHide, className }: {
	total: number;
	trend: { day: number; value: number }[];
	hide: boolean;
	onToggleHide: () => void;
	className?: string;
}) {
	const first = trend[0]?.value ?? total;
	const delta = total - first;
	const pct = first === 0 ? 0 : (delta / first) * 100;
	const up = delta >= 0;

	return (
		<BentoTile tone="dark" padding="none" className={className}>
			<div className="relative p-6 sm:p-8 h-full flex flex-col">
				{/* Decorative gradient orb */}
				<div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-navy-500/20 blur-3xl" />

				<div className="flex items-start justify-between">
					<div>
						<p className="text-[11px] font-work-sans font-bold tracking-[0.18em] uppercase text-navy-200/80">
							Total balance
						</p>
						<div className="flex items-baseline gap-2 mt-2">
							<h2 className="text-4xl sm:text-5xl font-work-sans font-bold tracking-tight">
								{fmtMoney(total, { hide })}
							</h2>
							<button
								onClick={onToggleHide}
								className="p-1.5 rounded-md text-navy-200/80 hover:text-white hover:bg-white/10 transition-colors"
								aria-label={hide ? "Show balance" : "Hide balance"}
							>
								{hide ? <EyeOff size={16} /> : <Eye size={16} />}
							</button>
						</div>
						<p className={`text-sm mt-2 font-medium flex items-center gap-1.5 ${up ? "text-emerald-300" : "text-red-300"}`}>
							{up ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
							{hide ? "••••" : `${up ? "+" : ""}${fmtMoney(delta, { compact: true })}`}
							<span className="text-navy-200/60 font-normal">
								({up ? "+" : ""}{pct.toFixed(2)}%) · 30d
							</span>
						</p>
					</div>

					<div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full backdrop-blur">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
						<span className="text-[11px] font-work-sans font-semibold text-white">Member FDIC</span>
					</div>
				</div>

				{/* Sparkline */}
				<div className="flex-1 min-h-[120px] mt-4 -mx-2">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={trend} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
							<defs>
								<linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%"  stopColor="#94A2B9" stopOpacity={0.5} />
									<stop offset="100%" stopColor="#94A2B9" stopOpacity={0} />
								</linearGradient>
							</defs>
							<XAxis dataKey="day" hide />
							<YAxis hide domain={["dataMin", "dataMax"]} />
							<Tooltip
								contentStyle={{ background: "#17223A", border: "1px solid #2C3E5A", borderRadius: 8, fontSize: 12 }}
								labelStyle={{ color: "#94A2B9" }}
								itemStyle={{ color: "#fff" }}
								formatter={(v: number) => [fmtMoney(v), "Balance"]}
								labelFormatter={(d: number) => `Day ${d}`}
							/>
							<Area type="monotone" dataKey="value" stroke="#BCC6D6" strokeWidth={2} fill="url(#balanceGrad)" />
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
		</BentoTile>
	);
}

// ── 2. Quick actions ──────────────────────────────────────────────────────
function QuickActionsTile({ className }: { className?: string }) {
	const actions: { label: string; icon: React.ReactNode; href: string; accent: string }[] = [
		{ label: "Transfer",  icon: <Send size={18} />,       href: "/dashboard/transfers",       accent: "bg-navy-50 text-navy-700" },
		{ label: "Deposit",   icon: <ArrowDownLeft size={18} />, href: "/dashboard/checks-and-bills",       accent: "bg-emerald-50 text-emerald-700" },
		{ label: "Pay bill",  icon: <Receipt size={18} />,    href: "/dashboard/checks-and-bills",           accent: "bg-amber-50 text-amber-700" },
		{ label: "Trade",     icon: <TrendingUp size={18} />, href: "/dashboard/trade",           accent: "bg-purple-50 text-purple-700" },
		{ label: "Cards",     icon: <CardIcon size={18} />,   href: "/dashboard/cards",           accent: "bg-sky-50 text-sky-700" },
		{ label: "Statements", icon: <FileText size={18} />,  href: "/dashboard/statements",      accent: "bg-rose-50 text-rose-700" },
	];
	return (
		<BentoTile className={className}>
			<TileHeader title="Quick actions" />
			<div className="grid grid-cols-3 gap-2 sm:gap-3">
				{actions.map((a) => (
					<a
						key={a.label}
						href={a.href}
						className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-light-100/60 hover:bg-navy-50/80 border border-transparent hover:border-navy-200 transition-all"
					>
						<div className={`w-9 h-9 rounded-lg flex items-center justify-center ${a.accent} transition-transform group-hover:scale-110`}>
							{a.icon}
						</div>
						<span className="text-[11px] font-work-sans font-semibold text-neutral-700 text-center">
							{a.label}
						</span>
					</a>
				))}
			</div>
		</BentoTile>
	);
}

// ── 3. Accounts list ──────────────────────────────────────────────────────
function AccountsTile({ accounts, className }: { accounts: Account[]; className?: string }) {
	return (
		<BentoTile className={className} href="/dashboard/accounts">
			<TileHeader
				title="Accounts"
				action={
					<span className="text-xs font-work-sans font-semibold text-navy-700 flex items-center gap-1 hover:gap-2 transition-all">
						View all <ChevronRight size={14} />
					</span>
				}
			/>
			{accounts.length === 0 ? (
				<div className="py-8 text-center text-sm text-neutral-400">
					No accounts yet. Open your first one from Quick Actions.
				</div>
			) : (
				<ul className="space-y-2.5">
					{accounts.slice(0, 4).map((a) => (
						<li
							key={a.id}
							className="flex items-center justify-between py-2 px-3 -mx-1 rounded-lg hover:bg-light-100/80 transition-colors"
						>
							<div className="flex items-center gap-3 min-w-0">
								<div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center text-navy-700 flex-shrink-0">
									<Wallet size={16} />
								</div>
								<div className="min-w-0">
									<p className="text-sm font-work-sans font-semibold text-neutral-900 truncate">
										{a.account_type}
									</p>
									<p className="text-[11px] text-neutral-500 font-gruppo truncate">
										{a.account_number}
									</p>
								</div>
							</div>
							<p className="text-sm font-work-sans font-bold text-neutral-900 tabular-nums">
								{fmtMoney(a.balance)}
							</p>
						</li>
					))}
				</ul>
			)}
		</BentoTile>
	);
}

// ── 4. Spending this month ───────────────────────────────────────────────
function SpendingTile({ transactions, className }: { transactions: Transaction[]; className?: string }) {
	const now = new Date();
	const monthTxs = transactions.filter(
		(t) => t.type === "debit" && new Date(t.created_at).getMonth() === now.getMonth(),
	);
	const spent = monthTxs.reduce((s, t) => s + t.amount, 0);

	// Top categories
	const byCat = new Map<string, number>();
	for (const t of monthTxs) {
		const k = t.category || "Other";
		byCat.set(k, (byCat.get(k) || 0) + t.amount);
	}
	const top = Array.from(byCat.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 3);
	const max = Math.max(1, ...top.map(([, v]) => v));

	return (
		<BentoTile className={className}>
			<TileHeader title="Spending this month" />
			<p className="text-3xl font-work-sans font-bold text-neutral-900 tabular-nums">
				{fmtMoney(spent, { compact: true })}
			</p>
			<p className="text-xs text-neutral-500 mt-1 font-gruppo">
				{monthTxs.length} transaction{monthTxs.length === 1 ? "" : "s"}
			</p>
			<div className="mt-5 space-y-2.5">
				{top.length === 0 && (
					<p className="text-xs text-neutral-400">No spending yet this month.</p>
				)}
				{top.map(([cat, amt]) => {
					const meta = CATEGORY_META[cat] ?? CATEGORY_META.Shopping;
					return (
						<div key={cat}>
							<div className="flex items-center justify-between text-xs font-medium mb-1">
								<span className="flex items-center gap-1.5 text-neutral-700">
									<span className={`inline-flex w-5 h-5 rounded items-center justify-center ${meta.bg} ${meta.color}`}>{meta.icon}</span>
									{cat}
								</span>
								<span className="text-neutral-900 font-work-sans font-semibold tabular-nums">
									{fmtMoney(amt, { compact: true })}
								</span>
							</div>
							<div className="h-1.5 rounded-full bg-light-200 overflow-hidden">
								<div
									className="h-full bg-navy-700 rounded-full transition-all"
									style={{ width: `${(amt / max) * 100}%` }}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</BentoTile>
	);
}

// ── 5. Upcoming bills ─────────────────────────────────────────────────────
function BillsTile({ bills, className }: { bills: Bill[]; className?: string }) {
	const upcoming = [...bills]
		.filter((b) => daysUntil(b.due_date) >= 0)
		.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
		.slice(0, 3);

	return (
		<BentoTile className={className} href="/dashboard/checks-and-bills">
			<TileHeader
				title="Upcoming bills"
				action={<ChevronRight size={14} className="text-neutral-400" />}
			/>
			{upcoming.length === 0 ? (
				<div className="py-6 text-center">
					<Receipt className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
					<p className="text-xs text-neutral-400">No bills due soon</p>
				</div>
			) : (
				<ul className="space-y-3">
					{upcoming.map((b) => {
						const days = daysUntil(b.due_date);
						const urgent = days <= 3;
						return (
							<li key={b.id} className="flex items-start justify-between gap-2">
								<div className="min-w-0">
									<p className="text-sm font-work-sans font-semibold text-neutral-900 truncate">
										{b.payee_name}
									</p>
									<p className={`text-[11px] font-medium flex items-center gap-1 mt-0.5 ${urgent ? "text-red-600" : "text-neutral-500"}`}>
										<Clock size={11} />
										{days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `In ${days} days`}
									</p>
								</div>
								<p className="text-sm font-work-sans font-bold text-neutral-900 tabular-nums flex-shrink-0">
									{fmtMoney(b.amount, { compact: true })}
								</p>
							</li>
						);
					})}
				</ul>
			)}
		</BentoTile>
	);
}

// ── 6. Recent transactions ───────────────────────────────────────────────
function RecentTransactionsTile({ transactions, className }: {
	transactions: Transaction[];
	className?: string;
}) {
	const recent = transactions.slice(0, 6);
	return (
		<BentoTile className={className}>
			<TileHeader
				title="Recent activity"
				action={
					<a
						href="/dashboard/transactions"
						className="text-xs font-work-sans font-semibold text-navy-700 flex items-center gap-1 hover:gap-2 transition-all"
					>
						View all <ChevronRight size={14} />
					</a>
				}
			/>
			{recent.length === 0 ? (
				<div className="py-8 text-center text-sm text-neutral-400">No recent transactions.</div>
			) : (
				<ul className="divide-y divide-light-200">
					{recent.map((t) => {
						const meta = categoryMeta(t);
						const credit = t.type === "credit";
						return (
							<li key={t.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
								<div className="flex items-center gap-3 min-w-0">
									<span className={`inline-flex w-8 h-8 rounded-lg items-center justify-center ${meta.bg} ${meta.color} flex-shrink-0`}>
										{meta.icon}
									</span>
									<div className="min-w-0">
										<p className="text-sm font-work-sans font-semibold text-neutral-900 truncate">
											{t.description || t.merchant || "Transaction"}
										</p>
										<p className="text-[11px] text-neutral-500 font-gruppo">
											{new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
											{" · "}
											{t.category || (credit ? "Credit" : "Debit")}
										</p>
									</div>
								</div>
								<p className={`text-sm font-work-sans font-bold tabular-nums flex-shrink-0 ${credit ? "text-emerald-600" : "text-neutral-900"}`}>
									{credit ? "+" : "−"}{fmtMoney(t.amount, { compact: true })}
								</p>
							</li>
						);
					})}
				</ul>
			)}
		</BentoTile>
	);
}

// ── 7. Cards preview ──────────────────────────────────────────────────────
function CardsTile({ cards, className }: { cards: any[]; className?: string }) {
	const primary = cards[0];
	const secondary = cards[1];

	function fmtCard(n: number): string {
		return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
	}

	return (
		<BentoTile className={className} href="/dashboard/cards">
			<TileHeader
				title="Cards"
				subtitle={cards.length > 0 ? `${cards.length} active` : "No cards yet"}
				action={<ChevronRight size={14} className="text-neutral-400" />}
			/>
			{!primary ? (
				<div className="py-6 flex flex-col items-center text-center">
					<div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center mb-3">
						<Plus size={20} />
					</div>
					<p className="text-sm font-work-sans font-semibold text-neutral-900">Apply for a card</p>
					<p className="text-xs text-neutral-500 mt-1 font-gruppo">
						Debit or credit · 3% cashback
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{/* Primary card — dark tone */}
					<div className="relative rounded-xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-4 text-white overflow-hidden shadow-md">
						<div className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-navy-500/25 blur-2xl" />
						<div className="flex items-start justify-between">
							<span className="text-[10px] font-work-sans font-bold tracking-[0.18em] uppercase text-navy-200">
								InvBank
							</span>
							<div className="flex items-center gap-2">
								<span className={`px-1.5 py-0.5 rounded text-[9px] font-work-sans font-semibold ${
									primary.status === "active" ? "bg-emerald-500/20 text-emerald-300" :
									primary.status === "locked" ? "bg-amber-500/20 text-amber-300" :
									"bg-red-500/20 text-red-300"
								}`}>
									{primary.status}
								</span>
								<CardIcon size={18} className="text-navy-200" />
							</div>
						</div>
						<p className="mt-5 text-sm font-mono tracking-[0.18em] text-navy-100">
							{primary.card_number}
						</p>
						<div className="flex items-end justify-between mt-3">
							<div>
								<p className="text-[9px] font-work-sans font-bold tracking-[0.14em] uppercase text-navy-300">Balance</p>
								<p className="text-lg font-work-sans font-bold tabular-nums">{fmtCard(primary.balance || 0)}</p>
							</div>
							<p className="text-[10px] font-work-sans font-semibold uppercase tracking-widest text-navy-200">
								{primary.card_brand}
							</p>
						</div>
					</div>

					{/* Secondary card peek (if any) */}
					{secondary && (
						<div className="relative rounded-xl bg-gradient-to-br from-navy-700 via-navy-600 to-navy-800 p-3 text-white overflow-hidden shadow-sm -mt-1 ml-2 mr-1">
							<div className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-navy-400/20 blur-2xl" />
							<div className="flex items-center justify-between">
								<span className="text-[9px] font-work-sans font-bold tracking-[0.16em] uppercase text-navy-200">InvBank</span>
								<span className="text-[9px] font-work-sans font-semibold uppercase tracking-widest text-navy-300">{secondary.card_brand}</span>
							</div>
							<p className="mt-2 text-xs font-mono tracking-[0.14em] text-navy-100">
								{secondary.card_number}
							</p>
						</div>
					)}

					{/* Summary row */}
					<div className="flex items-center justify-between pt-1">
						<div className="flex items-center gap-3">
							{primary.card_type && (
								<span className="text-[11px] font-work-sans font-semibold text-neutral-700 bg-light-100 px-2 py-0.5 rounded-lg">
									{primary.card_type}
								</span>
							)}
							{primary.expiry_date && (
								<span className="text-[11px] font-gruppo text-neutral-500">
									Exp {primary.expiry_date}
								</span>
							)}
						</div>
						{cards.length > 2 && (
							<span className="text-[11px] text-neutral-500 font-gruppo">
								+{cards.length - 2} more
							</span>
						)}
					</div>
				</div>
			)}
		</BentoTile>
	);
}

// ── 8. Portfolio / Trading CTA ────────────────────────────────────────────
function PortfolioTile({ investingBalance, className }: {
	investingBalance: number;
	className?: string;
}) {
	return (
		<BentoTile className={className} href="/dashboard/trade">
			<div className="flex items-stretch justify-between gap-6">
				<div className="flex-1 min-w-0">
					<TileHeader title="Invest & Trade" />
					<div className="flex items-baseline gap-2">
						<p className="text-3xl font-work-sans font-bold text-neutral-900 tabular-nums">
							{fmtMoney(investingBalance, { compact: true })}
						</p>
						<span className="text-xs font-work-sans font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
							+12.4%
						</span>
					</div>
					<p className="text-xs text-neutral-500 mt-1 font-gruppo">
						Portfolio value · live market data
					</p>
					<div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 bg-navy-700 hover:bg-navy-800 text-white rounded-lg text-xs font-work-sans font-semibold transition-colors">
						Open trading desk <ArrowRight size={14} />
					</div>
				</div>
				<div className="hidden sm:flex items-center">
					<div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-navy-50 to-navy-100 flex items-center justify-center border border-navy-200">
						<TrendingUp className="w-10 h-10 text-navy-700" />
					</div>
				</div>
			</div>
		</BentoTile>
	);
}

// ── 9. Market rates ───────────────────────────────────────────────────────
function RatesTile({ rates, className }: { rates: any[]; className?: string }) {
	return (
		<BentoTile className={className}>
			<TileHeader title="Market rates" subtitle="Live updates from global markets" />
			<ul className="space-y-3">
				{rates.map((r) => {
					const up = r.change >= 0;
					return (
						<li key={r.symbol} className="flex items-center justify-between text-sm">
							<div className="flex flex-col">
								<span className="text-neutral-900 font-work-sans font-bold uppercase tracking-tight">{r.symbol}</span>
								<span className="text-[10px] text-neutral-400 font-gruppo uppercase">Index · Spot</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="font-work-sans font-bold text-neutral-900 tabular-nums">
									{r.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</span>
								<span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums ${up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
									{up ? "+" : ""}{r.change.toFixed(2)}%
								</span>
							</div>
						</li>
					);
				})}
			</ul>
		</BentoTile>
	);
}

// ══════════════════════════════════════════════════════════════════════════
// Page
// ══════════════════════════════════════════════════════════════════════════

export default function DashboardPage() {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [cards, setCards] = useState<any[]>([]);
	const [bills, setBills] = useState<Bill[]>([]);
	const [loading, setLoading] = useState(true);
	const [hide, setHide] = useState(() => {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('dashboard_hide_balance') === 'true';
		}
		return false;
	});

	useEffect(() => {
		localStorage.setItem('dashboard_hide_balance', hide.toString());
	}, [hide]);

	const { user } = useAuth();

	// Live market rates for the dashboard
	const marketRates = useLiveQuotes([
		"BTCUSD", "ETHUSD", "SPY", "QQQ", "GOLD"
	], [
		{ symbol: "BTCUSD", price: 65422, change: -1.2 },
		{ symbol: "ETHUSD", price: 3452, change: 0.8 },
		{ symbol: "SPY", price: 524.12, change: 0.5 },
		{ symbol: "QQQ", price: 445.15, change: 1.1 },
		{ symbol: "GOLD", price: 2352.1, change: 0.3 }
	], { intervalMs: 15_000 });

	useEffect(() => {
		let alive = true;
		const load = async () => {
			try {
				const [accRes, cardRes, billRes] = await Promise.all([
					accountAPI.getAccounts(),
					cardAPI.getCards(),
					billAPI.getBills().catch(() => ({ data: [] as Bill[] })),
				]);
				if (!alive) return;
				const accs = accRes.data ?? [];
				setAccounts(accs);
				setCards(cardRes.data ?? []);
				setBills(billRes.data ?? []);

				// Pull transactions from all accounts in parallel, flatten + sort.
				if (accs.length > 0) {
					const txLists = await Promise.all(
						accs.map((a) => accountAPI.getAccountTransactions(a.id).then((r) => r.data ?? [])),
					);
					const all = txLists.flat().sort(
						(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
					);
					if (alive) setTransactions(all);
				} else {
					setTransactions([]);
				}
			} catch (err) {
				console.error("Dashboard load failed:", err);
			} finally {
				if (alive) setLoading(false);
			}
		};
		load();
		return () => { alive = false; };
	}, []);

	const totalBalance = useMemo(
		() => accounts.reduce((s, a) => s + a.balance, 0),
		[accounts],
	);
	const investingBalance = useMemo(
		() => accounts
			.filter((a) => /invest|trade|brokerage/i.test(a.account_type))
			.reduce((s, a) => s + a.balance, 0),
		[accounts],
	);
	const trend = useMemo(() => buildTrend(totalBalance, transactions), [totalBalance, transactions]);

	if (loading) {
		return (
			<ProtectedRoute>
				<DashboardLayout>
					<div className="flex items-center justify-center h-64">
						<div className="w-10 h-10 border-4 border-navy-700 border-t-transparent rounded-full animate-spin" />
					</div>
				</DashboardLayout>
			</ProtectedRoute>
		);
	}

	return (
		<ProtectedRoute>
			<DashboardLayout>
				<PageTransition>
					<div className="space-y-5 sm:space-y-6">
						{/* Greeting strip */}
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-work-sans font-semibold tracking-widest uppercase text-neutral-400">
									{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
								</p>
								<h1 className="text-2xl sm:text-3xl font-work-sans font-bold text-neutral-900 mt-1">
									{greeting()}, {user?.full_name?.split(" ")[0] ?? "there"}
								</h1>
							</div>
						</div>

						{/* Bento grid — 12 cols on desktop, stacks on mobile */}
						<div className="grid grid-cols-1 lg:grid-cols-12 auto-rows-auto gap-4 sm:gap-5">
							{/* Row 1 */}
							<BalanceTile
								className="lg:col-span-8"
								total={totalBalance}
								trend={trend}
								hide={hide}
								onToggleHide={() => setHide((h) => !h)}
							/>
							<QuickActionsTile className="lg:col-span-4" />

							{/* Row 2 */}
							<AccountsTile   className="lg:col-span-5" accounts={accounts} />
							<SpendingTile   className="lg:col-span-4" transactions={transactions} />
							<BillsTile      className="lg:col-span-3" bills={bills} />

							{/* Row 3 */}
							<RecentTransactionsTile className="lg:col-span-7" transactions={transactions} />
							<CardsTile              className="lg:col-span-5" cards={cards} />

							{/* Row 4 */}
							<PortfolioTile className="lg:col-span-8" investingBalance={investingBalance} />
							<RatesTile     className="lg:col-span-4" rates={marketRates} />
						</div>
					</div>
				</PageTransition>
			</DashboardLayout>
		</ProtectedRoute>
	);
}
