import { TickerItem, WatchlistItem, TradeIdea, EconomicEvent, NewsItem, HeatmapSector } from './types';

export const TICKER_DATA: TickerItem[] = [
  { symbol: 'AAPL', price: 182.52, change: 1.25 },
  { symbol: 'NVDA', price: 822.79, change: -0.45 },
  { symbol: 'TSLA', price: 175.22, change: 2.10 },
  { symbol: 'BTCUSD', price: 65422, change: -1.2 },
  { symbol: 'ETHUSD', price: 3452, change: 0.8 },
  { symbol: 'GOOGL', price: 152.12, change: 0.3 },
  { symbol: 'MSFT', price: 420.55, change: -0.15 },
  { symbol: 'AMZN', price: 178.22, change: 1.1 },
];

export const WATCHLIST_DATA: WatchlistItem[] = [
  { symbol: 'SPX', price: 5240.12, change: 0.82, sparkline: [10, 12, 11, 14, 13, 16, 15] },
  { symbol: 'NDX', price: 18230.15, change: 1.25, sparkline: [20, 22, 24, 23, 26, 28, 27] },
  { symbol: 'BTCUSD', price: 65422.0, change: -1.2, sparkline: [40, 38, 37, 39, 36, 35, 36] },
  { symbol: 'ETHUSD', price: 3452.1, change: 0.8, sparkline: [15, 16, 14, 15, 17, 18, 17] },
  { symbol: 'AAPL', price: 182.52, change: 1.25, sparkline: [10, 11, 10, 12, 13, 12, 14] },
  { symbol: 'TSLA', price: 175.22, change: 2.10, sparkline: [5, 6, 8, 7, 9, 11, 10] },
  { symbol: 'NVDA', price: 822.79, change: -0.45, sparkline: [30, 32, 31, 33, 32, 28, 29] },
  { symbol: 'GOLD', price: 2352.1, change: 0.5, sparkline: [12, 13, 12, 14, 15, 14, 16] },
];

export const TRADE_IDEAS: TradeIdea[] = [
  { id: '1', author: 'JH', symbol: 'BTCUSD', title: 'Major Breakout Imminent', sentiment: 'bullish', likes: 245, chartData: [10, 15, 12, 18, 22] },
  { id: '2', author: 'AL', symbol: 'TSLA', title: 'Gap Fill Potential', sentiment: 'bearish', likes: 112, chartData: [25, 20, 22, 18, 15] },
  { id: '3', author: 'TR', symbol: 'NVDA', title: 'Consolidation vs High Volatility', sentiment: 'bullish', likes: 532, chartData: [5, 5, 8, 12, 20] },
];

export const CALENDAR_DATA: EconomicEvent[] = [
  { id: '1', time: '13:30', event: 'Non-Farm Payrolls', impact: 'high', country: '🇺🇸', actual: '-', forecast: '200K', prior: '275K' },
  { id: '2', time: '14:00', event: 'CPI m/m', impact: 'high', country: '🇺🇸', actual: '-', forecast: '0.3%', prior: '0.4%' },
  { id: '3', time: '10:00', event: 'German ZEW Sentiment', impact: 'medium', country: '🇩🇪', actual: '31.7', forecast: '20.5', prior: '19.9' },
  { id: '4', time: '09:30', event: 'UK GDP q/q', impact: 'medium', country: '🇬🇧', actual: '0.1%', forecast: '0.1%', prior: '-0.3%' },
];

export const NEWS_DATA: NewsItem[] = [
  { id: '1', headline: 'Fed Signals Potential Rate Cut in Late 2024', source: 'Reuters', time: '1h ago', tag: 'Fed' },
  { id: '2', headline: 'Bitcoin Retests Critical Support at $65k', source: 'CoinDesk', time: '2h ago', tag: 'Crypto' },
  { id: '3', headline: 'Nvidia Market Cap Surges Past Rivals', source: 'Bloomberg', time: '3h ago', tag: 'Earnings' },
  { id: '4', headline: 'Gold Hits All-Time High Amid Geopolitical Tension', source: 'CNBC', time: '4h ago', tag: 'Gold' },
  { id: '5', headline: 'Tech Giants Face New Regulatory Hurdles in EU', source: 'WSJ', time: '5h ago', tag: 'Tech' },
  { id: '6', headline: 'Oil Prices Stabilize After Surprise Inventory Drop', source: 'Argus', time: '6h ago', tag: 'Energy' },
];

export const HEATMAP_DATA: HeatmapSector[] = [
  { name: 'Technology', performance: 1.5, weight: 30 },
  { name: 'Financials', performance: -0.4, weight: 15 },
  { name: 'Healthcare', performance: 0.2, weight: 12 },
  { name: 'Cons. Disc.', performance: 2.1, weight: 10 },
  { name: 'Comm. Services', performance: 0.8, weight: 8 },
  { name: 'Industrials', performance: -0.2, weight: 7 },
  { name: 'Cons. Staples', performance: 0.1, weight: 6 },
  { name: 'Energy', performance: -1.5, weight: 4 },
  { name: 'Utilities', performance: -0.5, weight: 3 },
  { name: 'Real Estate', performance: -1.2, weight: 3 },
  { name: 'Materials', performance: 0.3, weight: 2 },
];
