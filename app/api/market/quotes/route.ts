/**
 * GET /api/market/quotes?symbols=AAPL,NVDA,BTCUSD,ETHUSD&sparkline=1
 *
 * Unified live-quotes endpoint for the /dashboard/trade module.
 * Server-side so we avoid CORS + hide any API keys.
 *
 * Sources (no keys required):
 *   - Stocks / ETFs / indices → Yahoo Finance chart API (v8/finance/chart/{S})
 *   - Crypto (symbol contains USD / USDT) → Binance spot (api.binance.com)
 *
 * Response shape (unified):
 *   {
 *     quotes: { symbol, price, change, sparkline?: number[] }[],
 *     asOf:   ISO timestamp,
 *     source: "live" | "partial" | "fallback"
 *   }
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
// Cache at the edge for 15s — enough freshness for a ticker tape.
export const revalidate = 15;

interface UnifiedQuote {
	symbol: string;
	price: number;
	change: number; // percent
	sparkline?: number[];
}

// ─── helpers ──────────────────────────────────────────────────────────────
const isCrypto = (s: string): boolean => {
	const u = s.toUpperCase();
	return u.endsWith("USD") || u.endsWith("USDT") || u.endsWith("USDC");
};

const toBinanceSymbol = (s: string): string => {
	const u = s.toUpperCase().replace("/", "").replace("-", "");
	// BTCUSD → BTCUSDT, ETHUSD → ETHUSDT (Binance uses USDT pairs)
	if (u.endsWith("USD")) return u + "T";
	return u;
};

async function fetchYahooQuote(
	symbol: string,
	wantSparkline: boolean,
): Promise<UnifiedQuote | null> {
	try {
		const range = wantSparkline ? "1d" : "2d";
		const interval = wantSparkline ? "15m" : "1d";
		const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
			symbol,
		)}?interval=${interval}&range=${range}`;
		const res = await fetch(url, {
			headers: {
				// Yahoo rejects bare fetches without a UA; pretend to be a browser.
				"User-Agent":
					"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
				Accept: "application/json",
			},
			// Short timeout — we're in a hot path.
			next: { revalidate: 15 },
		});
		if (!res.ok) return null;
		const json = await res.json();
		const result = json?.chart?.result?.[0];
		if (!result) return null;
		const meta = result.meta || {};
		const price = Number(meta.regularMarketPrice ?? meta.previousClose ?? 0);
		const prev = Number(meta.chartPreviousClose ?? meta.previousClose ?? price);
		const change = prev ? ((price - prev) / prev) * 100 : 0;

		let sparkline: number[] | undefined;
		if (wantSparkline) {
			const closes: (number | null)[] =
				result.indicators?.quote?.[0]?.close || [];
			const clean = closes.filter(
				(n): n is number => typeof n === "number" && Number.isFinite(n),
			);
			// Down-sample to ~16 points so it renders nicely in a tiny sparkline.
			if (clean.length > 0) {
				const step = Math.max(1, Math.floor(clean.length / 16));
				sparkline = clean.filter((_, i) => i % step === 0).slice(0, 16);
			}
		}

		return { symbol: symbol.toUpperCase(), price, change, sparkline };
	} catch {
		return null;
	}
}

async function fetchBinanceQuote(
	symbol: string,
	wantSparkline: boolean,
): Promise<UnifiedQuote | null> {
	try {
		const binSym = toBinanceSymbol(symbol);
		const [tickerRes, klineRes] = await Promise.all([
			fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binSym}`, {
				next: { revalidate: 15 },
			}),
			wantSparkline
				? fetch(
						`https://api.binance.com/api/v3/klines?symbol=${binSym}&interval=1h&limit=16`,
						{ next: { revalidate: 60 } },
				  )
				: Promise.resolve(null as any),
		]);
		if (!tickerRes.ok) return null;
		const t = await tickerRes.json();
		const price = parseFloat(t.lastPrice ?? "0");
		const change = parseFloat(t.priceChangePercent ?? "0");
		let sparkline: number[] | undefined;
		if (klineRes && klineRes.ok) {
			const klines: any[][] = await klineRes.json();
			sparkline = klines.map((k) => parseFloat(k[4])); // close price
		}
		return { symbol: symbol.toUpperCase(), price, change, sparkline };
	} catch {
		return null;
	}
}

// ─── route handler ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const symbolsParam = url.searchParams.get("symbols") || "";
	const wantSparkline = url.searchParams.get("sparkline") === "1";
	const symbols = symbolsParam
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean)
		.slice(0, 30); // sanity cap

	if (symbols.length === 0) {
		return NextResponse.json(
			{ error: "Provide ?symbols=AAPL,NVDA,…" },
			{ status: 400 },
		);
	}

	const results = await Promise.all(
		symbols.map((s) =>
			isCrypto(s)
				? fetchBinanceQuote(s, wantSparkline)
				: fetchYahooQuote(s, wantSparkline),
		),
	);

	const quotes = results.filter((q): q is UnifiedQuote => q !== null);
	const source: "live" | "partial" | "fallback" =
		quotes.length === symbols.length
			? "live"
			: quotes.length === 0
				? "fallback"
				: "partial";

	return NextResponse.json(
		{ quotes, asOf: new Date().toISOString(), source },
		{
			headers: {
				// 15s CDN cache — live enough for a retail trading UI,
				// cheap enough not to hammer Yahoo/Binance on every page view.
				"Cache-Control":
					"public, s-maxage=15, stale-while-revalidate=45",
			},
		},
	);
}
