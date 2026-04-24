/**
 * Market-data service for /dashboard/trade.
 *
 *   fetchHistoricalData(symbol, timeframe) → OHLCV candles (Binance, public)
 *   fetchQuotes(symbols, opts)             → live prices/changes (/api/market/quotes)
 *   fetchLiveNews()                        → live headlines (/api/market/news)
 *
 * All fetchers fail soft — they return [] on error so callers can fall back
 * to seed data. Client-side only (uses relative URLs for the /api routes so
 * the Next.js server proxies to Yahoo / Binance / CNBC without CORS / keys).
 */

import { useEffect, useRef, useState } from "react";

// ─── Candles (chart) ──────────────────────────────────────────────────────
export interface Candle {
	time: number;
	open: number;
	high: number;
	low: number;
	close: number;
	volume?: number;
}

/**
 * Binance klines — public, no key. Crypto symbols only.
 * For stocks, we fall back to Yahoo via /api/market/quotes sparkline (elsewhere).
 */
/**
 * Unified historical data fetcher. 
 * If it looks like crypto, uses Binance. Otherwise, uses Yahoo via our proxy.
 */
export async function fetchHistoricalData(
	symbol: string,
	timeframe: string,
): Promise<Candle[]> {
	const normalized = symbol.toUpperCase().replace("/", "").replace("-", "");
	const isCrypt = normalized.endsWith("USD") || normalized.endsWith("USDT");

	if (isCrypt) {
		const intervalMap: Record<string, string> = {
			"1m": "1m", "5m": "5m", "15m": "15m", "1h": "1h", "4h": "4h", "1D": "1d", "1W": "1w",
		};
		const interval = intervalMap[timeframe] || "1h";
		const binanceSymbol = normalized.endsWith("USD") ? normalized + "T" : normalized;

		try {
			const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=500`);
			if (!res.ok) throw new Error("Binance feed failed");
			const data: any[][] = await res.json();
			return data.map((d) => ({
				time: d[0], // Binance uses ms
				open: parseFloat(d[1]),
				high: parseFloat(d[2]),
				low: parseFloat(d[3]),
				close: parseFloat(d[4]),
				volume: parseFloat(d[5]),
			}));
		} catch (err) {
			console.error("Binance fetch failed, trying Yahoo...", err);
		}
	}

	// Yahoo Fallback (for Stocks or if Binance failed)
	try {
		const intervalMap: Record<string, string> = {
			"1m": "1m", "5m": "5m", "15m": "15m", "1h": "1h", "4h": "1h", "1D": "1d", "1W": "1wk",
		};
		const rangeMap: Record<string, string> = {
			"1m": "1d", "5m": "5d", "15m": "5d", "1h": "1mo", "4h": "3mo", "1D": "1y", "1W": "2y",
		};
		const interval = intervalMap[timeframe] || "1d";
		const range = rangeMap[timeframe] || "1y";
		
		// We use the same chart API as the sparkline but with more data
		const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}`;
		const res = await fetch(url, {
			headers: { "User-Agent": "Mozilla/5.0" }
		});
		if (!res.ok) throw new Error("Yahoo feed failed");
		const json = await res.json();
		const result = json?.chart?.result?.[0];
		if (!result) return [];

		const timestamps: number[] = result.timestamp || [];
		const ohlc = result.indicators?.quote?.[0] || {};
		
		return timestamps.map((t, i) => ({
			time: t * 1000, // Yahoo uses seconds
			open: ohlc.open?.[i] ?? 0,
			high: ohlc.high?.[i] ?? 0,
			low: ohlc.low?.[i] ?? 0,
			close: ohlc.close?.[i] ?? 0,
			volume: ohlc.volume?.[i] ?? 0,
		})).filter(c => c.open !== 0);
	} catch (err) {
		console.error("fetchHistoricalData total failure:", err);
		return [];
	}
}

// ─── Unified quotes (ticker tape + watchlist) ─────────────────────────────
export interface Quote {
	symbol: string;
	price: number;
	change: number;
	sparkline?: number[];
}

export async function fetchQuotes(
	symbols: string[],
	opts: { withSparkline?: boolean } = {},
): Promise<Quote[]> {
	if (symbols.length === 0) return [];
	try {
		const qs = new URLSearchParams({ symbols: symbols.join(",") });
		if (opts.withSparkline) qs.set("sparkline", "1");
		const res = await fetch(`/api/market/quotes?${qs.toString()}`);
		if (!res.ok) throw new Error(`quotes ${res.status}`);
		const json = await res.json();
		return Array.isArray(json.quotes) ? json.quotes : [];
	} catch (err) {
		console.error("fetchQuotes failed:", err);
		return [];
	}
}

// ─── Live news ────────────────────────────────────────────────────────────
export interface LiveNewsItem {
	id: string;
	headline: string;
	source: string;
	time: string;
	tag: string;
	url: string;
}

export async function fetchLiveNews(): Promise<LiveNewsItem[]> {
	try {
		const res = await fetch(`/api/market/news`);
		if (!res.ok) throw new Error(`news ${res.status}`);
		const json = await res.json();
		return Array.isArray(json.items) ? json.items : [];
	} catch (err) {
		console.error("fetchLiveNews failed:", err);
		return [];
	}
}

// ─── React hooks — poll & merge live data with seed fallbacks ────────────
/**
 * Live quotes hook. Seeds with `fallback`, then polls every `intervalMs`.
 * On error, silently keeps the last good snapshot (or seed).
 */
export function useLiveQuotes<T extends { symbol: string }>(
	symbols: string[],
	fallback: T[],
	opts: { intervalMs?: number; withSparkline?: boolean } = {},
): T[] {
	const [data, setData] = useState<T[]>(fallback);
	const fallbackRef = useRef(fallback);
	fallbackRef.current = fallback;

	useEffect(() => {
		let alive = true;
		const load = async () => {
			const quotes = await fetchQuotes(symbols, {
				withSparkline: opts.withSparkline,
			});
			if (!alive || quotes.length === 0) return;
			// Merge live quote onto fallback shape so sparkline/other fields
			// from the seed survive for any symbol the API skipped.
			const byS = new Map(quotes.map((q) => [q.symbol.toUpperCase(), q]));
			const merged = fallbackRef.current.map((f) => {
				const live = byS.get(f.symbol.toUpperCase());
				if (!live) return f;
				return {
					...f,
					price: live.price,
					change: Number(live.change.toFixed(2)),
					...(live.sparkline && live.sparkline.length > 0
						? { sparkline: live.sparkline }
						: {}),
				} as T;
			});
			setData(merged);
		};
		load();
		const id = setInterval(load, opts.intervalMs ?? 30_000);
		return () => {
			alive = false;
			clearInterval(id);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [symbols.join(","), opts.intervalMs, opts.withSparkline]);

	return data;
}

/**
 * Live news hook. Seeds with `fallback`, polls every `intervalMs`.
 */
export function useLiveNews<T extends { id: string }>(
	fallback: T[],
	intervalMs = 180_000,
): T[] {
	const [data, setData] = useState<T[]>(fallback);
	useEffect(() => {
		let alive = true;
		const load = async () => {
			const items = await fetchLiveNews();
			if (!alive || items.length === 0) return;
			// Cast is safe: LiveNewsItem is a superset of the seed NewsItem shape.
			setData(items as unknown as T[]);
		};
		load();
		const id = setInterval(load, intervalMs);
		return () => {
			alive = false;
			clearInterval(id);
		};
	}, [intervalMs]);
	return data;
}

// ─── Real-time WebSockets (Free/Public) ───────────────────────────────────

/**
 * Real-time price updates via Binance WebSocket (Crypto only).
 */
export function useLivePrice(symbol: string, initialPrice: number): number {
	const [price, setPrice] = useState(initialPrice);

	useEffect(() => {
		const normalized = symbol.toUpperCase().replace("/", "").replace("-", "");
		const isCrypt = normalized.endsWith("USD") || normalized.endsWith("USDT");
		if (!isCrypt) return;

		const streamSymbol = normalized.toLowerCase().endsWith("usd") 
			? normalized.toLowerCase() + "t" 
			: normalized.toLowerCase();
			
		const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamSymbol}@ticker`);
		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.c) setPrice(parseFloat(data.c));
		};
		return () => ws.close();
	}, [symbol]);

	return price;
}

/**
 * Real-time candle updates via Binance WebSocket (Crypto only).
 * Connects to a kline stream and returns the latest incomplete candle.
 */
export function useLiveCandle(symbol: string, timeframe: string): Candle | null {
	const [candle, setCandle] = useState<Candle | null>(null);

	useEffect(() => {
		const normalized = symbol.toUpperCase().replace("/", "").replace("-", "");
		const isCrypt = normalized.endsWith("USD") || normalized.endsWith("USDT");
		if (!isCrypt) return;

		const streamSymbol = normalized.toLowerCase().endsWith("usd") 
			? normalized.toLowerCase() + "t" 
			: normalized.toLowerCase();
		
		const intervalMap: Record<string, string> = {
			"1m": "1m", "5m": "5m", "15m": "15m", "1h": "1h", "4h": "4h", "1D": "1d",
		};
		const interval = intervalMap[timeframe] || "1h";

		const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamSymbol}@kline_${interval}`);
		ws.onmessage = (event) => {
			const { k } = JSON.parse(event.data);
			setCandle({
				time: k.t,
				open: parseFloat(k.o),
				high: parseFloat(k.h),
				low: parseFloat(k.l),
				close: parseFloat(k.c),
				volume: parseFloat(k.v),
			});
		};
		return () => ws.close();
	}, [symbol, timeframe]);

	return candle;
}
