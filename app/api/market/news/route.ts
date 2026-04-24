/**
 * GET /api/market/news
 *
 * Live market news for the /dashboard/trade module.
 * Pulls CNBC Markets RSS (free, no key) server-side, parses XML,
 * and returns a unified NewsItem[] matching the trade module's shape.
 *
 * Response shape:
 *   { items: { id, headline, source, time, tag, url }[], asOf, source }
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 120; // 2-minute cache

interface NewsItem {
	id: string;
	headline: string;
	source: string;
	time: string;
	tag: string;
	url: string;
}

// CNBC Markets RSS — no auth, updates every few minutes.
const FEED_URL =
	"https://www.cnbc.com/id/100003114/device/rss/rss.html";
const FEED_SOURCE = "CNBC";

// ─── tiny XML helpers (no external deps) ─────────────────────────────────
function extractTagAll(xml: string, tag: string): string[] {
	const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "g");
	const out: string[] = [];
	let m: RegExpExecArray | null;
	while ((m = re.exec(xml))) out.push(m[1]);
	return out;
}

function extractTagFirst(xml: string, tag: string): string {
	const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
	return m ? m[1] : "";
}

function stripCdata(s: string): string {
	return s
		.replace(/<!\[CDATA\[/g, "")
		.replace(/\]\]>/g, "")
		.trim();
}

function relativeTime(isoish: string): string {
	const d = new Date(isoish);
	if (isNaN(d.getTime())) return "recent";
	const diffMs = Date.now() - d.getTime();
	const mins = Math.round(diffMs / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.round(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.round(hours / 24);
	return `${days}d ago`;
}

function deriveTag(headline: string): string {
	const h = headline.toLowerCase();
	if (/\b(fed|fomc|rate cut|interest rate|powell)\b/.test(h)) return "Fed";
	if (/\b(bitcoin|btc|ether|eth|crypto)\b/.test(h)) return "Crypto";
	if (/\b(earning|revenue|quarterly)\b/.test(h)) return "Earnings";
	if (/\b(oil|crude|brent|energy)\b/.test(h)) return "Energy";
	if (/\b(gold|silver|commodit)\b/.test(h)) return "Metals";
	if (/\b(dollar|euro|yen|currency|forex)\b/.test(h)) return "FX";
	if (/\b(nvidia|tesla|apple|microsoft|amazon|google|meta|tech)\b/.test(h))
		return "Tech";
	return "Markets";
}

// ─── route handler ───────────────────────────────────────────────────────
export async function GET() {
	try {
		const res = await fetch(FEED_URL, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (compatible; InvBankMarketNewsBot/1.0; +https://invbank.us)",
				Accept: "application/rss+xml, application/xml, text/xml",
			},
			next: { revalidate: 120 },
		});
		if (!res.ok) throw new Error(`feed ${res.status}`);
		const xml = await res.text();

		const itemXmls = extractTagAll(xml, "item").slice(0, 12);
		const items: NewsItem[] = itemXmls.map((it, i) => {
			const title = stripCdata(extractTagFirst(it, "title"));
			const link = stripCdata(extractTagFirst(it, "link"));
			const pubDate = stripCdata(extractTagFirst(it, "pubDate"));
			const guid = stripCdata(extractTagFirst(it, "guid")) || `${i}-${title}`;
			return {
				id: guid.slice(0, 64),
				headline: title,
				source: FEED_SOURCE,
				time: relativeTime(pubDate),
				tag: deriveTag(title),
				url: link,
			};
		});

		return NextResponse.json(
			{ items, asOf: new Date().toISOString(), source: "live" },
			{
				headers: {
					"Cache-Control":
						"public, s-maxage=120, stale-while-revalidate=300",
				},
			},
		);
	} catch (err) {
		// Upstream failure — let the client fall back to its seed data.
		return NextResponse.json(
			{
				items: [],
				asOf: new Date().toISOString(),
				source: "fallback",
				error: err instanceof Error ? err.message : "feed error",
			},
			{ status: 200 },
		);
	}
}
