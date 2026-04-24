export interface TickerItem {
  symbol: string;
  price: number;
  change: number;
}

export interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  sparkline: number[];
}

export interface TradeIdea {
  id: string;
  author: string;
  symbol: string;
  title: string;
  sentiment: 'bullish' | 'bearish';
  likes: number;
  chartData: number[];
}

export interface EconomicEvent {
  id: string;
  time: string;
  event: string;
  impact: 'low' | 'medium' | 'high';
  country: string;
  actual: string;
  forecast: string;
  prior: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  time: string;
  tag: string;
}

export interface HeatmapSector {
  name: string;
  performance: number;
  weight: number;
}
