"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  Search, LayoutGrid, Palette, Plus, ChevronRight, ChevronLeft, ChevronDown,
  Settings, Bell, User, MessageSquare, TrendingUp, TrendingDown,
  Clock, Calendar, Zap, Play, CheckCircle, Smartphone, Star, X,
  ArrowUpRight, ArrowDownRight, Globe, Shield, CreditCard,
  Menu, Filter, Share2, Maximize2, MoreHorizontal, MousePointer2,
  Minus, Type, Eye, Lock, Layers
} from 'lucide-react';
// 'motion/react' → 'framer-motion' (already installed in Next app, identical API for motion/AnimatePresence/Reorder)
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, UTCTimestamp, LineStyle, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { fetchHistoricalData, Candle, useLiveQuotes, useLiveNews, useLiveCandle } from './services/marketService';
import { 
  TICKER_DATA, WATCHLIST_DATA, TRADE_IDEAS, CALENDAR_DATA, 
  NEWS_DATA, HEATMAP_DATA 
} from './constants';
import { TickerItem, WatchlistItem, NewsItem } from './types';
import { accountAPI, tradeAPI, type Account } from '@/lib/api';

// Symbols we poll live for the ticker tape + watchlist. Covers major US equities
// + top crypto pairs. All resolve via /api/market/quotes (server-side Yahoo + Binance).
const TICKER_SYMBOLS = TICKER_DATA.map(t => t.symbol);
const WATCHLIST_SYMBOLS = WATCHLIST_DATA.map(w => w.symbol);

// --- Utility Components ---

const Badge = ({ children, color = 'blue' }: { children: React.ReactNode, color?: string }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    navy: 'bg-navy-500/10 text-navy-400 border-navy-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
};

// --- Sub-components (Feature Implementations) ---

// 1. Ticker Tape — LIVE (Yahoo Finance stocks + Binance crypto via /api/market/quotes)
const TickerTape = () => {
  const items = useLiveQuotes<TickerItem>(TICKER_SYMBOLS, TICKER_DATA, { intervalMs: 20_000 });
  return (
    <div className="h-6 bg-[#131722] border-b border-[#2a2e39] flex items-center px-4 gap-6 text-[10px] overflow-hidden whitespace-nowrap shrink-0">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="flex flex-row gap-8"
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex gap-2 items-center font-medium">
            <span className="text-[#b2b5be] uppercase">{item.symbol}</span>
            <span className="text-white">{item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            <span className={item.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- Symbol Search Modal ---
const SymbolSearch = ({ onClose, onSelect }: { onClose: () => void, onSelect: (symbol: string) => void }) => {
  const popularSymbols = ["BTCUSD", "ETHUSD", "AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "EURUSD", "GOLD"];
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-[320px] bg-[#1e222d] rounded-lg border border-[#363a45] overflow-hidden shadow-2xl"
      >
        <div className="p-3 border-b border-[#363a45] flex items-center gap-2 bg-[#131722]">
          <Search size={14} className="text-gray-500" />
          <input autoFocus placeholder="Search symbols..." className="bg-transparent w-full focus:outline-none text-xs text-[#d1d4dc]" />
        </div>
        <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
          <div className="text-[9px] uppercase font-bold text-gray-500 px-2 py-1">Popular</div>
          {popularSymbols.map(s => (
            <div 
              key={s} 
              onClick={() => { onSelect(s); onClose(); }}
              className="px-2 py-2 hover:bg-[#2962ff] rounded cursor-pointer text-xs text-[#d1d4dc] flex justify-between items-center group transition-colors"
            >
              <span className="font-bold">{s}</span>
              <span className="text-[9px] opacity-40 group-hover:opacity-100">INDEX</span>
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-[#363a45] bg-[#131722]/50 text-center">
          <button onClick={onClose} className="text-[10px] text-gray-500 hover:text-white">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
};

// 2. Chart Layout Switcher & Toolbar
const Toolbar = ({ 
  layout, 
  setLayout, 
  onAddIndicator, 
  timeframe, 
  setTimeframe, 
  symbol, 
  onSearchSymbol 
}: { 
  layout: number, 
  setLayout: (l: number) => void, 
  onAddIndicator: () => void, 
  timeframe: string, 
  setTimeframe: (t: string) => void,
  symbol: string,
  onSearchSymbol: () => void
}) => {
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D', '1W'];
  return (
    <div className="h-9 bg-[#131722] border-b border-[#2a2e39] flex items-center justify-between px-4 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <div 
          onClick={onSearchSymbol}
          className="flex items-center gap-1.5 text-xs font-bold text-white cursor-pointer px-1 hover:bg-[#363a45] rounded-sm py-1 transition-colors"
        >
          <span>{symbol}</span>
          <ChevronDown size={12} className="text-[#b2b5be]" />
        </div>
        <div className="h-4 w-px bg-[#2a2e39]" />
        
        {/* Timeframe Switcher */}
        <div className="flex items-center gap-0.5">
          {timeframes.map(tf => (
            <button 
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${timeframe === tf ? 'text-[#2962ff]' : 'text-[#b2b5be] hover:bg-[#363a45] hover:text-white'}`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-[#2a2e39]" />
        <div className="flex items-center gap-1 bg-[#131722]/50 rounded p-0.5">
          {[1, 2, 4].map(l => (
            <button 
              key={l}
              onClick={() => setLayout(l)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${layout === l ? 'bg-[#2962ff] text-white' : 'text-[#b2b5be] hover:bg-[#363a45]'}`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-[#2a2e39]" />
        <button 
          onClick={onAddIndicator}
          className="flex items-center gap-1 text-[11px] font-bold text-[#2962ff] hover:bg-[#2a2e39]/50 px-2 py-1 rounded cursor-pointer"
        >
          <Plus size={14} />
          <span>Indicators</span>
        </button>
      </div>
      <div className="flex items-center gap-4 text-[10px]">
        <div className="hidden sm:flex gap-3">
          <span className="text-[#089981] font-bold">H: 66,200</span>
          <span className="text-[#f23645] font-bold">L: 64,100</span>
        </div>
        <button className="bg-[#2962ff] px-2.5 py-1 rounded text-white font-bold text-[10px]">Publish</button>
      </div>
    </div>
  );
};

// 3. Drawing Tools Sidebar & Account Balances
const AccountBalances = ({ isLoggedIn, accounts = [] }: { isLoggedIn: boolean, accounts?: Account[] }) => {
  const totalBalance = useMemo(() => accounts.reduce((sum, acc) => sum + acc.balance, 0), [accounts]);
  
  const items = useMemo(() => [
    { id: 'equity', label: 'Total Equity', value: isLoggedIn ? `$${totalBalance.toLocaleString()}` : '$0.00' },
    { id: 'bp', label: 'Buying Power', value: isLoggedIn ? `$${(totalBalance * 0.95).toLocaleString()}` : '$0.00' },
    { id: 'profit', label: 'Day P/L', value: isLoggedIn ? '+$1,120.40' : '$0.00', color: isLoggedIn ? 'text-[#089981]' : '' },
    { id: 'used', label: 'Used Margin', value: isLoggedIn ? '12.4%' : '0%' },
  ], [isLoggedIn, totalBalance]);

  return (
    <div className="w-24 bg-[#131722] border-r border-[#2a2e39] flex flex-col shrink-0 overflow-hidden">
      <div className="p-2 border-b border-[#2a2e39] text-[8px] uppercase font-bold text-[#b2b5be] bg-[#1c212b] select-none">
        Terminal Info
      </div>
      <div className="flex-1 flex flex-col p-2 gap-4">
        {items.map((s) => (
          <div key={s.id} className="flex flex-col gap-0.5 group">
            <span className="text-[7px] text-gray-500 uppercase tracking-widest font-bold group-hover:text-[#2962ff] transition-colors">{s.label}</span>
            <span className={`text-[9px] font-mono font-bold leading-none ${s.color || 'text-[#d1d4dc]'}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-[#2a2e39] bg-[#1c212b]/50">
        <div className="flex items-center gap-1.5 justify-center">
          <div className={`w-1.5 h-1.5 rounded-full ${isLoggedIn ? 'bg-[#089981]' : 'bg-gray-600'} animate-pulse`} />
          <span className="text-[7px] font-bold text-gray-500 uppercase tracking-tighter">Sync</span>
        </div>
      </div>
    </div>
  );
};

const DrawingSidebar = () => {
  const [tools, setTools] = useState([
    { id: 'cursor', icon: <MousePointer2 size={16} />, active: false },
    { id: 'trend', icon: <TrendingUp size={16} /> },
    { id: 'line', icon: <Minus size={16} /> },
    { id: 'layers', icon: <Layers size={16} />, active: true },
    { id: 'palette', icon: <Palette size={16} /> },
    { id: 'text', icon: <Type size={16} /> },
    { id: 'filter', icon: <Filter size={16} /> },
    { id: 'eye', icon: <Eye size={16} /> },
    { id: 'settings', icon: <Settings size={16} />, mt: true },
  ]);

  return (
    <div className="w-10 bg-[#131722] border-r border-[#2a2e39] flex flex-col items-center py-2 z-10 shrink-0 text-[#b2b5be] cursor-move">
      <Reorder.Group axis="y" values={tools} onReorder={setTools} className="flex flex-col items-center gap-4 w-full">
        {tools.map((t) => (
          <Reorder.Item 
            key={t.id} 
            value={t} 
            className={`p-1.5 rounded cursor-grab active:cursor-grabbing transition-colors ${t.mt ? 'mt-auto' : ''} ${t.active ? 'text-[#2962ff] bg-[#1e222d]' : 'hover:bg-[#2a2e39] hover:text-white'}`}
          >
            {t.icon}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

// 4. Main Chart (Candlesticks) - Overhauled with lightweight-charts for 100% Realism
const MainChart = ({ layoutIdx, timeframe, symbol, price, onTrade }: { layoutIdx: number, timeframe: string, symbol: string, price: number, onTrade: (side: 'BUY' | 'SELL') => void }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<any> | null>(null);
  
  const [showOneClick, setShowOneClick] = useState(true);
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#131722' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2a2e39' },
        horzLines: { color: '#2a2e39' },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          width: 1,
          color: '#758696',
          style: LineStyle.LargeDashed,
          labelBackgroundColor: '#2962ff',
        },
        horzLine: {
          width: 1,
          color: '#758696',
          style: LineStyle.LargeDashed,
          labelBackgroundColor: '#2962ff',
        },
      },
      rightPriceScale: {
        borderColor: '#2a2e39',
      },
      timeScale: {
        borderColor: '#2a2e39',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#089981',
      downColor: '#f23645',
      borderVisible: false,
      wickUpColor: '#089981',
      wickDownColor: '#f23645',
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // set as an overlay
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight 
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Fetch and Sync Data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const rawData = await fetchHistoricalData(symbol, timeframe);
      if (rawData.length > 0 && seriesRef.current && volumeSeriesRef.current) {
        const formattedData: CandlestickData[] = rawData.map(d => ({
          time: (d.time / 1000) as UTCTimestamp,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));

        const formattedVolume = rawData.map(d => ({
          time: (d.time / 1000) as UTCTimestamp,
          value: d.volume || 0,
          color: d.close >= d.open ? 'rgba(8, 153, 129, 0.3)' : 'rgba(242, 54, 69, 0.3)',
        }));

        seriesRef.current.setData(formattedData);
        volumeSeriesRef.current.setData(formattedVolume);
        
        chartRef.current?.timeScale().fitContent();
      }
      setIsLoading(false);
    };
    loadData();
  }, [symbol, timeframe]);

  const liveCandle = useLiveCandle(symbol, timeframe);

  useEffect(() => {
    if (liveCandle && seriesRef.current) {
      seriesRef.current.update({
        time: (liveCandle.time / 1000) as UTCTimestamp,
        open: liveCandle.open,
        high: liveCandle.high,
        low: liveCandle.low,
        close: liveCandle.close,
      });
    }
  }, [liveCandle]);

  return (
    <div className="relative w-full h-full bg-[#131722] flex flex-col group overflow-hidden cursor-crosshair">
       {/* 1. Floating One-Click Trading Widget */}
       <div className="absolute top-12 left-4 z-20 flex flex-col items-start gap-1">
        <button 
          onClick={() => setShowOneClick(!showOneClick)}
          className={`h-6 px-2 rounded-sm text-[9px] font-bold border transition-all ${showOneClick ? 'bg-[#2962ff] border-[#2962ff] text-white' : 'bg-[#1e222d] border-[#363a45] text-gray-400 hover:text-white'}`}
        >
          {showOneClick ? 'ONE-CLICK ON' : 'ONE-CLICK'}
        </button>
        
        <AnimatePresence>
          {showOneClick && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="flex items-stretch bg-[#1e222d] border border-[#2a2e39] rounded shadow-xl overflow-hidden h-10"
            >
              <button 
                onClick={() => onTrade('SELL')}
                className="bg-[#f23645] hover:bg-[#d12e3b] px-3 flex flex-col justify-center items-center gap-0.5 text-white active:scale-95 transition-all w-20"
              >
                <span className="text-[10px] font-bold">SELL</span>
                <span className="text-[8px] font-mono opacity-80">{price?.toFixed(2)}</span>
              </button>
              <div className="w-12 bg-[#131722] flex flex-col items-center justify-center border-l border-r border-[#2a2e39]">
                <input 
                  type="number" value={tradeQuantity} onChange={(e) => setTradeQuantity(Number(e.target.value))}
                  className="w-full bg-transparent text-center text-[10px] font-bold text-white focus:outline-none"
                />
              </div>
              <button 
                onClick={() => onTrade('BUY')}
                className="bg-[#089981] hover:bg-[#067a68] px-3 flex flex-col justify-center items-center gap-0.5 text-white active:scale-95 transition-all w-20"
              >
                <span className="text-[10px] font-bold">BUY</span>
                <span className="text-[8px] font-mono opacity-80">{price?.toFixed(2)}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute top-2 left-4 text-[#d1d4dc] text-[10px] font-bold z-10 opacity-80 flex items-center gap-2 pointer-events-none">
        <span className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {symbol} • {timeframe} • REAL DATA
        </span>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-30 bg-[#131722] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-[#2962ff] border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fetching Market Data...</span>
          </div>
        </div>
      )}

      <div ref={chartContainerRef} className="flex-1 w-full" />
    </div>
  );
};

// 6. RSI Pane
const RSIPane = () => {
  const [data] = useState(Array.from({ length: 40 }, (_, i) => ({ val: 30 + Math.random() * 40 })));
  return (
    <div className="h-20 bg-[#131722] border-t border-[#2a2e39] p-2 flex shrink-0 group">
      <div className="w-48 border-r border-[#2a2e39] flex flex-col gap-1 pr-2">
        <div className="text-[10px] font-bold flex justify-between">
          <span className="text-[#b2b5be]">RSI(14)</span>
          <span className="text-[#2962ff]">58.42</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <Line type="monotone" dataKey={() => 70} stroke="#363a45" strokeDasharray="2" dot={false} />
            <Line type="monotone" dataKey={() => 30} stroke="#363a45" strokeDasharray="2" dot={false} />
            <Area type="monotone" dataKey="val" stroke="#787b86" fill="transparent" strokeWidth={1} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 pl-3 overflow-hidden relative">
        <div className="text-[10px] text-gray-500 font-mono">{'// RSI Cross Strategy'}</div>
        <div className="text-[10px] text-blue-400 font-mono">{'strategy("RSI Cross", overlay=true)'}</div>
        <div className="text-[10px] text-green-400 opacity-60 font-mono">{'if (ta.crossover(rsi, 70)) strategy.entry("Long")'}</div>
        <button className="absolute right-2 top-2 bg-[#089981] text-white text-[9px] px-2 py-1 rounded font-bold">Run backtest</button>
      </div>
    </div>
  );
};

// 7. Order Book
const OrderBook = ({ symbol, price }: { symbol: string, price: number }) => (
  <div className="flex flex-col h-1/2 bg-[#131722] border-b border-[#2a2e39]">
    <div className="p-1 border-b border-[#2a2e39] text-[9px] uppercase font-bold text-[#b2b5be] text-center bg-[#1e222d]/50">
      Order Book • {symbol}
    </div>
    <div className="flex-1 flex flex-col font-mono text-[9px] py-1">
      {/* Asks */}
      <div className="flex-1 flex flex-col-reverse overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`ask-${i}`} className="flex justify-between px-2 text-[#f23645] leading-tight group">
            <span className="group-hover:bg-[#f23645]/10">{(price + (6 - i) * (price * 0.0001)).toFixed(2)}</span>
            <span className="text-[#b2b5be]">{(Math.random() * 2).toFixed(2)}</span>
          </div>
        ))}
      </div>
      {/* Spread */}
      <div className="h-4 bg-[#1e222d] flex items-center justify-center font-bold text-[#b2b5be] my-0.5 text-[8px]">
        Spread: {(price * 0.00005).toFixed(2)}
      </div>
      {/* Bids */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`bid-${i}`} className="flex justify-between px-2 text-[#089981] leading-tight group">
            <span className="group-hover:bg-[#089981]/10">{(price - (i + 1) * (price * 0.0001)).toFixed(2)}</span>
            <span className="text-[#b2b5be]">{(Math.random() * 2).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 7.1 Market Depth Chart
const DepthChart = ({ price }: { price: number }) => {
  const data = useMemo(() => {
    const bids = Array.from({ length: 20 }, (_, i) => ({
      price: price - (i * price * 0.0005),
      volume: Math.pow(i, 1.5) * 10 + Math.random() * 50,
      type: 'bid'
    })).reverse();
    const asks = Array.from({ length: 20 }, (_, i) => ({
      price: price + (i * price * 0.0005),
      volume: Math.pow(i, 1.5) * 10 + Math.random() * 50,
      type: 'ask'
    }));
    return [...bids, ...asks];
  }, [price]);

  return (
    <div className="h-48 bg-[#131722] border-b border-[#2a2e39] p-2 flex flex-col">
       <div className="flex justify-between items-center mb-2">
         <span className="text-[9px] font-bold text-[#b2b5be] uppercase tracking-widest">Market Depth</span>
         <div className="flex gap-2">
           <span className="text-[8px] text-[#089981]">Bids: 48%</span>
           <span className="text-[8px] text-[#f23645]">Asks: 52%</span>
         </div>
       </div>
       <div className="flex-1">
         <ResponsiveContainer width="100%" height="100%">
           <AreaChart data={data}>
             <defs>
               <linearGradient id="depthBid" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#089981" stopOpacity={0.3}/>
                 <stop offset="95%" stopColor="#089981" stopOpacity={0}/>
               </linearGradient>
               <linearGradient id="depthAsk" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#f23645" stopOpacity={0.3}/>
                 <stop offset="95%" stopColor="#f23645" stopOpacity={0}/>
               </linearGradient>
             </defs>
             <XAxis dataKey="price" hide />
             <Area 
               type="stepAfter" 
               dataKey="volume" 
               stroke="#089981" 
               fill="url(#depthBid)" 
               isAnimationActive={false}
               connectNulls={false}
             />
           </AreaChart>
         </ResponsiveContainer>
       </div>
    </div>
  );
};

// 8. Time & Sales
const TimeAndSales = ({ price }: { price: number }) => (
  <div className="flex-1 flex flex-col bg-[#131722] min-h-0 border-b border-[#2a2e39]">
    <div className="p-1 border-b border-[#2a2e39] text-[9px] uppercase font-bold text-[#b2b5be] text-center bg-[#1e222d]/50">
      Time & Sales
    </div>
    <div className="flex-1 overflow-hidden font-mono text-[9px] py-1 px-2 space-y-0.5">
      {Array.from({ length: 12 }).map((_, i) => {
        const isUp = Math.random() > 0.5;
        return (
          <div key={i} className="flex justify-between items-center leading-tight">
            <span className={isUp ? 'text-[#089981]' : 'text-[#f23645]'}>
              {(price + (Math.random() - 0.5) * (price * 0.0002)).toFixed(2)}
            </span>
            <span className="text-[#b2b5be]">{(Math.random() * 0.1).toFixed(3)}</span>
            <span className="text-gray-600 truncate ml-2">12:05:{59-i}</span>
          </div>
        );
      })}
    </div>
    {/* Broker Mini Widget */}
    <div className="h-16 bg-[#1e222d] border-t border-[#2a2e39] p-2 flex flex-col gap-1.5 shrink-0">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-[#d1d4dc]">BROKER</span>
        <span className="text-[8px] bg-green-500/20 text-green-500 px-1 rounded">Connected</span>
      </div>
      <div className="flex gap-1">
        <button className="flex-1 bg-[#089981] text-white py-1 rounded text-[9px] font-bold hover:bg-[#067a68] transition-colors">BUY</button>
        <button className="flex-1 bg-[#f23645] text-white py-1 rounded text-[9px] font-bold hover:bg-[#d12e3b] transition-colors">SELL</button>
      </div>
    </div>
  </div>
);

// 9. Watchlist — Overhauled for High Density
const Watchlist = ({ activeSymbol, onSelectSymbol, onAddSymbol, symbols = WATCHLIST_SYMBOLS }: { activeSymbol: string, onSelectSymbol: (s: string) => void, onAddSymbol?: () => void, symbols?: string[] }) => {
  const watchlistData = useMemo(() => {
    return symbols.map(s => {
      const seed = WATCHLIST_DATA.find(w => w.symbol === s);
      if (seed) return seed;
      return { symbol: s, price: 0, change: 0, sparkline: [0,0,0,0,0,0,0] };
    });
  }, [symbols]);

  const items = useLiveQuotes<WatchlistItem>(symbols, watchlistData, {
    intervalMs: 30_000,
    withSparkline: true,
  });
  return (
  <div className="bg-[#131722] flex flex-col h-full shrink-0 overflow-hidden">
    <div className="h-9 border-b border-[#2a2e39] flex items-center justify-between px-3 bg-[#1e222d] shrink-0">
      <span className="text-[10px] font-bold text-[#d1d4dc] uppercase tracking-wider flex items-center gap-2">
        Watchlist
        <ChevronDown size={12} className="text-gray-500" />
      </span>
      <div className="flex items-center gap-3">
        <Search size={14} className="text-gray-500 cursor-pointer hover:text-white transition-colors" />
        <span onClick={onAddSymbol} className="text-lg text-[#2962ff] font-light cursor-pointer hover:text-white transition-colors leading-none">+</span>
      </div>
    </div>
    
    <div className="grid grid-cols-12 px-3 py-1.5 border-b border-[#2a2e39] text-[8px] font-bold text-gray-500 uppercase tracking-tighter shrink-0">
      <div className="col-span-4">Symbol</div>
      <div className="col-span-3 text-right">Last</div>
      <div className="col-span-5 text-right">Chg%</div>
    </div>

    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {items.map((item, i) => (
        <div 
          key={item.symbol} 
          onClick={() => onSelectSymbol(item.symbol)}
          className={`px-3 py-2 transition-all border-b border-[#2a2e39]/20 flex flex-col cursor-pointer group ${item.symbol === activeSymbol ? 'bg-[#2962ff]/10 border-l-2 border-l-[#2962ff]' : 'hover:bg-[#2a2e39]/30'}`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <span className={`text-[10px] font-bold ${item.symbol === activeSymbol ? 'text-white' : 'text-[#d1d4dc] group-hover:text-white'}`}>{item.symbol}</span>
              <span className="text-[8px] text-gray-600 font-medium uppercase tracking-tighter">Indices • CFD</span>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono font-bold text-white tracking-tighter">{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={`text-[9px] font-bold ${item.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
              </span>
            </div>
          </div>
          
          {/* Subtle Sparkline at the bottom of each item */}
          <div className="h-4 w-full mt-1 opacity-40 group-hover:opacity-80 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={(item.sparkline || [0,0,0,0]).map(v => ({ v }))}>
                <Line type="monotone" dataKey="v" stroke={item.change >= 0 ? '#089981' : '#f23645'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
    
    {/* Details Panel Mock */}
    <div className="h-24 border-t border-[#2a2e39] bg-[#1e222d]/30 p-3 shrink-0">
       <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-white">{activeSymbol}</span>
          <span className="text-[8px] px-1 bg-[#2962ff]/20 text-[#2962ff] rounded">PRO</span>
       </div>
       <p className="text-[9px] text-gray-500 leading-tight line-clamp-2">Real-time market data is provided by our premium tier nodes. Institutional liquidity enabled.</p>
    </div>
  </div>
  );
};

// 10. Heatmap
const Heatmap = () => (
  <div className="w-full h-full p-2 flex flex-col gap-2">
    <span className="text-[10px] font-bold uppercase tracking-wider text-[#b2b5be]">Market Heatmap</span>
    <div className="grid grid-cols-3 grid-rows-2 gap-1 flex-1">
      {HEATMAP_DATA.slice(0, 6).map((item) => (
        <div 
          key={item.name}
          className={`rounded flex items-center justify-center text-[9px] font-bold transition-transform hover:scale-[1.02] cursor-pointer ${
            item.performance > 1 ? 'bg-[#089981]' : 
            item.performance > 0 ? 'bg-[#089981] opacity-70' : 
            item.performance < -1 ? 'bg-[#f23645]' : 'bg-[#f23645] opacity-60'
          }`}
        >
          {item.name.substring(0, 4).toUpperCase()}
        </div>
      ))}
    </div>
  </div>
);

// 11. Economic Calendar
const EconomicCalendar = () => (
  <div className="w-full h-full p-2 overflow-hidden">
    <span className="text-[10px] font-bold uppercase text-[#b2b5be]">Economic Calendar</span>
    <div className="mt-1 space-y-1">
      {CALENDAR_DATA.map((event) => (
        <div key={event.id} className="text-[9px] flex items-center justify-between hover:bg-white/5 p-0.5 rounded cursor-pointer">
          <span className="truncate pr-2">{event.country} {event.event}</span>
          <span className={`px-1 rounded font-bold ${event.impact === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
            {event.impact === 'high' ? 'High' : 'Med'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// 12. Trade Ideas & News — news is LIVE via /api/market/news (CNBC RSS)
const IdeasFeed = () => {
  const news = useLiveNews<NewsItem>(NEWS_DATA);
  return (
  <div className="w-full h-full p-2 flex flex-col overflow-y-auto custom-scrollbar">
    <div className="flex items-center justify-between mb-3 px-1">
      <span className="text-[10px] font-bold uppercase text-[#b2b5be]">Community Ideas</span>
      <span className="text-[9px] text-[#2962ff] font-bold cursor-pointer">View More</span>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 flex-1 min-h-0 mb-6">
      {TRADE_IDEAS.slice(0, 3).map((idea) => (
        <div key={idea.id} className="flex-1 bg-[#1e222d] rounded-xl p-3 flex flex-col gap-2 border border-[#2a2e39] hover:border-[#2962ff]/50 transition-all cursor-pointer group hover:shadow-lg hover:shadow-[#2962ff]/5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold">{idea.author}</div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white">{idea.author}</span>
              <span className="text-[7px] text-gray-500 uppercase">{idea.symbol}</span>
            </div>
            <span className={`ml-auto text-[7px] px-1.5 py-0.5 rounded font-bold ${idea.sentiment === 'bullish' ? 'bg-[#089981]/10 text-[#089981]' : 'bg-[#f23645]/10 text-[#f23645]'}`}>
              {idea.sentiment === 'bullish' ? 'LONG' : 'SHORT'}
            </span>
          </div>
          <p className="text-[10px] text-[#d1d4dc] font-medium leading-snug line-clamp-2">{idea.title}</p>
          <div className="h-14 bg-[#131722] rounded-lg flex items-center justify-center overflow-hidden border border-[#2a2e39]">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={idea.chartData.map(v => ({ v }))}>
                <defs>
                  <linearGradient id={`grad-${idea.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={idea.sentiment === 'bullish' ? '#089981' : '#f23645'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={idea.sentiment === 'bullish' ? '#089981' : '#f23645'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={idea.sentiment === 'bullish' ? '#089981' : '#f23645'} fill={`url(#grad-${idea.id})`} strokeWidth={1} />
              </AreaChart>
             </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-1 text-[8px] text-gray-500 mt-1">
             <Star size={8} /> {idea.likes} likes
          </div>
        </div>
      ))}
    </div>

    {/* Section for Mobile/Desktop Unified News */}
    <div className="flex items-center justify-between mb-3 px-1 border-t border-[#2a2e39] pt-4">
      <span className="text-[10px] font-bold uppercase text-[#b2b5be]">Latest Market News</span>
      <span className="text-[9px] text-[#2962ff] font-bold cursor-pointer">See all</span>
    </div>
    <div className="space-y-3 pb-4">
       {news.map((n) => (
         <a key={n.id} href={(n as any).url || '#'} target="_blank" rel="noopener noreferrer" className="flex gap-4 p-2 rounded-lg hover:bg-[#1e222d] transition-colors cursor-pointer group">
           <div className="flex-1">
             <div className="flex items-center gap-2 mb-1">
               <span className="text-[8px] px-1.5 py-0.5 bg-[#2962ff]/10 text-[#2962ff] rounded font-bold uppercase tracking-tighter">{n.tag}</span>
               <span className="text-[8px] text-gray-500">{n.source} • {n.time}</span>
             </div>
             <p className="text-[11px] font-bold text-[#d1d4dc] group-hover:text-white transition-colors">{n.headline}</p>
           </div>
           <div className="w-16 h-16 bg-[#131722] rounded-lg border border-[#2a2e39] flex items-center justify-center shrink-0">
              <Globe size={20} className="text-[#363a45]" />
           </div>
         </a>
       ))}
    </div>
  </div>
  );
};

// 13. News & Dominance Sidebar — news is LIVE via /api/market/news
const SideContent = () => {
  const news = useLiveNews<NewsItem>(NEWS_DATA);
  return (
  <div className="w-80 bg-[#131722] border-l border-[#2a2e39] flex flex-col shrink-0">
    {/* Crypto Dominance */}
    <div className="p-6 border-b border-[#2a2e39]">
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Market Dominance</h3>
      <div className="h-4 w-full flex bg-[#2a2e39] rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: '52%' }} className="h-full bg-orange-500" title="BTC" />
        <motion.div initial={{ width: 0 }} animate={{ width: '18%' }} className="h-full bg-blue-500" title="ETH" />
        <motion.div initial={{ width: 0 }} animate={{ width: '8%' }} className="h-full bg-yellow-400" title="BNB" />
        <motion.div initial={{ width: 0 }} animate={{ width: '22%' }} className="h-full bg-gray-500" title="Others" />
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-bold text-[#d1d4dc]">
        <span className="text-orange-500">BTC 52%</span>
        <span className="text-blue-500">ETH 18%</span>
        <span>OTH 30%</span>
      </div>
    </div>
    {/* News Feed */}
    <div className="flex-1 flex flex-col">
      <div className="px-6 py-4 border-b border-[#2a2e39] flex justify-between items-center">
        <span className="text-xs font-bold text-[#d1d4dc] uppercase">Live News</span>
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {news.map((n) => (
          <a key={n.id} href={(n as any).url || '#'} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-2 group cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#2962ff] uppercase">{n.tag}</span>
              <span className="text-[10px] text-gray-500">{n.time}</span>
            </div>
            <h4 className="text-xs font-medium text-[#d1d4dc] group-hover:text-[#2962ff] transition-colors leading-relaxed line-clamp-2">
              {n.headline}
            </h4>
            <span className="text-[10px] text-gray-500 italic">via {n.source}</span>
          </a>
        ))}
      </div>
    </div>
  </div>
  );
};

// 14. Pine Script Editor & Backtest
const PineEditor = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const runBacktest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
    }, 2000);
  };

  const sampleCode = `// @version=5
strategy("RSI Breakout", overlay=true)

rsiVal = ta.rsi(close, 14)
buySignal = ta.crossover(rsiVal, 30)
sellSignal = ta.crossunder(rsiVal, 70)

if (buySignal)
    strategy.entry("Long", strategy.long)

if (sellSignal)
    strategy.close("Long")`;

  return (
    <section className="bg-[#131722] border-t border-[#2a2e39] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-[#d1d4dc] tracking-tight">
              Power your strategies with <span className="text-[#2962ff]">Pine Script™</span>
            </h2>
            <p className="text-gray-400 text-lg">
              A powerful programming language created for traders. Write indicators, backtest strategies, and automate your edge.
            </p>
            <div className="bg-[#1e222d] rounded-2xl p-6 border border-[#2a2e39] shadow-2xl overflow-hidden relative group">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="text-[10px] text-gray-500 ml-2 font-mono">strategy_rsi.pine</span>
              </div>
              <pre className="text-xs font-mono text-[#d1d4dc] leading-relaxed whitespace-pre-wrap">
                {sampleCode.split('\n').map((line, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-gray-600 select-none w-4">{i + 1}</span>
                    <span>
                      {line.includes('//') ? <span className="text-gray-500">{line}</span> : line}
                    </span>
                  </div>
                ))}
              </pre>
              <div className="mt-6 flex gap-4">
                <button 
                  onClick={runBacktest}
                  disabled={isRunning}
                  className="flex-1 bg-[#2962ff] hover:bg-[#1e4bd8] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isRunning ? <Clock size={18} className="animate-spin" /> : <Play size={18} />}
                  {isRunning ? 'Backtesting...' : 'Run Performance Test'}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showResults && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1e222d] rounded-2xl overflow-hidden border border-[#2962ff]/30 shadow-[0_0_50px_rgba(41,98,255,0.1)]"
              >
                <div className="p-6 border-b border-[#2a2e39] flex justify-between items-center">
                  <h3 className="text-lg font-bold text-[#d1d4dc]">Strategy Performance</h3>
                  <button onClick={() => setShowResults(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
                </div>
                <div className="grid grid-cols-2 gap-4 p-6">
                  {[
                    { label: 'Net Profit', value: '+245.2%', color: 'text-[#089981]' },
                    { label: 'Win Rate', value: '68.5%', color: 'text-[#d1d4dc]' },
                    { label: 'Max Drawdown', value: '12.4%', color: 'text-[#f23645]' },
                    { label: 'Profit Factor', value: '2.14', color: 'text-[#089981]' },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 bg-[#131722] rounded-xl border border-[#2a2e39]">
                      <span className="text-[10px] uppercase font-bold text-gray-500">{stat.label}</span>
                      <div className={`text-xl font-bold ${stat.color} mt-1`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
                <div className="h-48 px-6 pb-6">
                   <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={Array.from({ length: 20 }, (_, i) => ({ v: i * i + Math.random() * 50 }))}>
                      <Area type="monotone" dataKey="v" stroke="#2962ff" fill="#2962ff20" strokeWidth={2} />
                    </AreaChart>
                   </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// 15. Broker Integration & Order Ticket
const BrokerSection = () => (
  <section className="bg-[#1e222d] py-12 border-t border-[#2a2e39]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold text-[#d1d4dc] leading-tight">
            Connect to your <span className="text-[#2962ff]">Broker</span> & trade live
          </h2>
          <div className="flex flex-wrap gap-4">
            {['OANDA', 'TradeStation', 'FOREX.COM', 'Interactive Brokers', 'Gemini', 'OKX', 'BingX', 'Tradovate'].map(b => (
              <div key={b} className="px-6 py-3 bg-[#131722] border border-[#2a2e39] rounded-full text-xs font-bold text-[#d1d4dc] hover:border-[#2962ff] transition-colors cursor-pointer">
                {b}
              </div>
            ))}
          </div>
          <p className="text-gray-400">Trade directly on the charts with 100% execution transparency.</p>
        </div>
        <div className="w-full lg:w-96 bg-[#131722] p-6 rounded-2xl border border-[#2a2e39] shadow-2xl">
          <div className="flex gap-2 mb-6">
            <button className="flex-1 bg-[#089981] text-white font-bold py-3 rounded-lg text-sm">Buy</button>
            <button className="flex-1 bg-[#f23645]/20 text-[#f23645] font-bold py-3 rounded-lg text-sm hover:bg-[#f23645]/30">Sell</button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Quantity</label>
              <input type="number" defaultValue="0.1" className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-lg px-4 py-3 text-[#d1d4dc] font-mono focus:outline-none focus:border-[#2962ff]" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Order Type</label>
              <select className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-lg px-4 py-3 text-[#d1d4dc] appearance-none focus:outline-none focus:border-[#2962ff]">
                <option>Market</option>
                <option>Limit</option>
                <option>Stop</option>
              </select>
            </div>
            <button className="w-full h-14 bg-[#2962ff] text-white font-bold rounded-xl mt-4 shadow-[0_0_30px_rgba(41,98,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all">
              Execute Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// 16. Mobile Section
const MobileSection = () => (
  <section className="bg-[#050505] py-24 border-t border-[#1a1a1a] overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="order-2 lg:order-1 relative flex justify-center">
        {/* Phone Mockup */}
        <div className="w-[280px] h-[580px] bg-[#1a1c24] rounded-[50px] border-[8px] border-[#363a45] shadow-[0_0_100px_rgba(41,98,255,0.2)] relative overflow-hidden flex flex-col pt-12">
           <div className="h-4 w-28 bg-[#363a45] rounded-full absolute top-6 left-1/2 -translate-x-1/2" />
           <div className="px-6 flex-1 flex flex-col gap-4">
              <div className="h-32 bg-[#2a2e39] rounded-2xl w-full" />
              <div className="space-y-2">
                <div className="h-4 bg-[#2a2e39] rounded w-3/4" />
                <div className="h-4 bg-[#2a2e39] rounded w-1/2" />
              </div>
              <div className="h-48 bg-[#2a2e39] rounded-2xl w-full" />
           </div>
           <div className="p-6">
              <div className="h-12 bg-blue-500 rounded-xl w-full" />
           </div>
        </div>
        {/* Floating Notifications */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -right-6 top-1/4 bg-[#1e222d] border border-[#2a2e39] p-4 rounded-2xl shadow-2xl z-20 flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500"><Bell size={20} /></div>
          <div>
            <div className="text-[10px] font-bold text-green-500">WHALE ALERT</div>
            <div className="text-xs font-bold text-white">500 BTC moved to Binance</div>
          </div>
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute -left-10 top-1/2 bg-[#1e222d] border border-[#2a2e39] p-4 rounded-2xl shadow-2xl z-20 flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500"><Zap size={20} /></div>
          <div>
            <div className="text-[10px] font-bold text-blue-500">PRICE REACHED</div>
            <div className="text-xs font-bold text-white">AAPL hit target $185.00</div>
          </div>
        </motion.div>
      </div>
      <div className="order-1 lg:order-2 space-y-8">
        <h2 className="text-5xl font-black text-white leading-tight uppercase italic">
          Charting in your <span className="text-[#2962ff]">pocket</span>
        </h2>
        <p className="text-gray-400 text-xl">The world’s most powerful charting app, reimagined for high-density mobile environments.</p>
        <div className="flex gap-4">
          <button className="h-14 px-8 bg-white text-black rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
            <Smartphone size={24} /> App Store
          </button>
          <button className="h-14 px-8 bg-transparent border border-white text-white rounded-lg font-bold flex items-center gap-2 hover:bg-white/10 transition-colors">
             Google Play
          </button>
        </div>
      </div>
    </div>
  </section>
);

// 17. Testimonials
const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const quotes = [
    { name: "Satoshi G.", role: "Macro Trader", text: "TradingView has been the backbone of my technical analysis for a decade. Nothing else compares.", stars: 5 },
    { name: "Elena R.", role: "Crypto Analyst", text: "The community ideas and Pine Script capabilities are light years ahead of any other platform.", stars: 5 },
    { name: "Marcus T.", role: "Hedge Fund Manager", text: "Reliability is key. I've never seen these charts lag when volatility spikes. Industry standard.", stars: 5 },
  ];

  useEffect(() => {
    const timer = setInterval(() => setIndex(prev => (prev + 1) % quotes.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#131722] py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex justify-center gap-1">
              {[...Array(quotes[index].stars)].map((_, i) => <Star key={i} size={24} fill="#2962ff" color="#2962ff" />)}
            </div>
            <blockquote className="text-3xl md:text-4xl font-medium text-white italic leading-snug">
              &ldquo;{quotes[index].text}&rdquo;
            </blockquote>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#2962ff] to-blue-400 flex items-center justify-center text-xl font-bold text-white mb-4">
                {quotes[index].name.split('')[0]}
              </div>
              <h4 className="text-lg font-bold text-white">{quotes[index].name}</h4>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">{quotes[index].role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-3 mt-12">
          {quotes.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === index ? 'w-8 bg-[#2962ff]' : 'bg-gray-800'}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

// 18. Sticky Bottom CTA
const StickyBottomCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-4xl"
        >
          <div className="bg-[#2962ff] rounded-2xl p-6 shadow-[0_10px_50px_rgba(41,98,255,0.4)] relative flex flex-col md:flex-row items-center gap-6 justify-between border border-white/20">
            <button 
              onClick={() => setIsDismissed(true)}
              className="absolute top-2 right-2 text-white/60 hover:text-white"
            >
              <X size={18} />
            </button>
            <div className="text-left font-bold text-white">
              <h4 className="text-xl">Start charting for free</h4>
              <p className="text-sm opacity-80">No credit card needed • Join 50M+ traders</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input 
                placeholder="Your email address" 
                className="flex-1 md:w-64 bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/50 focus:outline-none focus:bg-white/20"
              />
              <button className="bg-white text-[#2962ff] px-6 py-3 rounded-xl font-black whitespace-nowrap hover:scale-[1.05] transition-transform">
                Sign Up
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Mock Components for Indicator Search ---
const IndicatorSearch = ({ onClose }: { onClose: () => void }) => {
  const indicators = ["Relative Strength Index (RSI)", "Moving Average Conv/Div (MACD)", "Bollinger Bands", "Exponential Moving Average", "Ichimoku Cloud"];
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-[280px] bg-[#1e222d] rounded-lg border border-[#363a45] overflow-hidden shadow-2xl p-3"
      >
        <div className="flex items-center gap-2 mb-3 bg-[#131722] border border-[#363a45] rounded p-2">
          <Search size={14} className="text-gray-500" />
          <input autoFocus placeholder="Search indicators..." className="bg-transparent w-full focus:outline-none text-xs text-[#d1d4dc]" />
        </div>
        <div className="text-[10px] space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
          {indicators.map(i => (
            <div key={i} className="px-2 py-1.5 hover:bg-[#2962ff] rounded cursor-pointer text-[#d1d4dc] transition-colors">
              {i}
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-3 w-full text-[10px] text-gray-500 hover:text-white transition-colors">Close</button>
      </motion.div>
    </div>
  );
};

import { useAuth } from "@/contexts/AuthContext";

// --- Main App Component ---

export default function App() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [layout, setLayout] = useState(1);
  const [showIndicators, setShowIndicators] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const handleSelectSymbol = (s: string) => {
    setSymbol(s);
    handleAddSymbol(s);
  };
  const [timeframe, setTimeframe] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('tv_timeframe') || '1h';
    return '1h';
  });
  const [symbol, setSymbol] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('tv_symbol') || 'BTCUSD';
    return 'BTCUSD';
  });
  const isLoggedIn = !!user;
  const [price, setPrice] = useState(65000);
  const [activeTab, setActiveTab] = useState('Chart'); 
  const [toast, setToast] = useState<{ message: string, type: 'BUY' | 'SELL' } | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>(WATCHLIST_SYMBOLS);
  const [sidebarOrder, setSidebarOrder] = useState(['balances', 'drawing']);

  useEffect(() => {
    if (user) {
      accountAPI.getAccounts().then(res => {
        if (res.data) setAccounts(res.data);
      });
      tradeAPI.getWatchlist().then(res => {
        if (res.data) setWatchlist(res.data);
      });
    }
  }, [user]);

  const handleTrade = async (side: 'BUY' | 'SELL') => {
    if (!isLoggedIn) {
      setToast({ message: "Connect InvBank account to trade", type: side });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      const response = await tradeAPI.placeOrder({
        symbol,
        side,
        quantity: 0.1, // Default quantity for demo
        price: price
      });

      if (response.data) {
        setToast({ message: `Order Executed: ${side} ${symbol} @ $${price.toFixed(2)}`, type: side });
        // Refresh accounts to reflect balance change
        accountAPI.getAccounts().then(res => {
          if (res.data) setAccounts(res.data);
        });
      } else {
        setToast({ message: `Trade failed: ${response.error || 'Unknown error'}`, type: side });
      }
    } catch (err) {
      setToast({ message: "Failed to execute trade", type: side });
    }
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    localStorage.setItem('tv_symbol', symbol);
    const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    setPrice((seed % 1000) * 10 || 65000);
  }, [symbol]);

  useEffect(() => {
    localStorage.setItem('tv_timeframe', timeframe);
  }, [timeframe]);

  const handleAddSymbol = async (s: string) => {
    if (watchlist.includes(s)) return;
    const newWatchlist = [...watchlist, s];
    setWatchlist(newWatchlist);
    if (isLoggedIn) {
      await tradeAPI.updateWatchlist(newWatchlist);
    }
  };

  // Real-time price feed via Binance WebSocket
  useEffect(() => {
    const normalizedSymbol = symbol.toUpperCase().replace('/', '').replace('-', '');
    const binanceSymbol = (normalizedSymbol.includes('USD') ? normalizedSymbol + 'T' : normalizedSymbol).toLowerCase();
    
    // Connect to Binance WebSocket for real-time prices
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${binanceSymbol}@ticker`);
    
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.c) {
        setPrice(parseFloat(msg.c));
      }
    };

    return () => ws.close();
  }, [symbol]);

  return (
    <div className="h-screen w-screen bg-[#131722] text-[#d1d4dc] font-sans selection:bg-[#2962ff]/30 overflow-hidden flex flex-col relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 20 }} exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-lg shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${
              toast.message.includes('executed') 
                ? (toast.type === 'BUY' ? 'bg-[#089981]/90 border-[#089981] text-white' : 'bg-[#f23645]/90 border-[#f23645] text-white')
                : 'bg-[#1e222d]/90 border-[#2a2e39] text-[#d1d4dc]'
            }`}
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'BUY' ? 'bg-white' : 'bg-white'}`} />
            <span className="text-xs font-bold uppercase tracking-tight">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden sm:block">
        <TickerTape />
      </div>
      
      {/* Header (Nav) */}
      <header className="h-12 bg-[#131722] border-b border-[#2a2e39] flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 cursor-pointer">
            <div className="text-[#2962ff] font-bold text-xl flex items-center gap-1">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6z"/></svg>
              <span className="text-sm sm:text-lg font-bold text-white tracking-tighter">InvBank<span className="text-[#2962ff]">Pro</span></span>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-[#b2b5be]">
            <span className="text-white">Products</span>
            <span className="hover:text-white transition-colors cursor-pointer">Community</span>
            <span className="hover:text-white transition-colors cursor-pointer">Markets</span>
            <span className="hover:text-white transition-colors cursor-pointer">News</span>
            <span className="hover:text-white transition-colors cursor-pointer">Brokers</span>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge color="navy">Institutional Tier</Badge>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-navy-900 border border-navy-700 flex items-center justify-center text-[10px] font-bold text-white uppercase">
            {user?.full_name?.split(' ').map(n => n[0]).join('') || '??'}
          </div>
          <Menu size={20} className="lg:hidden cursor-pointer" />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-1 min-h-0 relative">
        <Reorder.Group 
          axis="x" 
          values={sidebarOrder} 
          onReorder={setSidebarOrder}
          className="hidden lg:flex"
        >
          {sidebarOrder.map((id) => (
            <Reorder.Item key={id} value={id}>
              {id === 'balances' ? (
                <AccountBalances isLoggedIn={isLoggedIn} accounts={accounts} />
              ) : (
                <DrawingSidebar />
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className={`flex-1 flex flex-col min-h-0 ${activeTab !== 'Chart' ? 'hidden sm:flex' : 'flex'}`}>
            <Toolbar 
              layout={layout} 
              setLayout={setLayout} 
              onAddIndicator={() => setShowIndicators(true)} 
              timeframe={timeframe} 
              setTimeframe={setTimeframe} 
              symbol={symbol}
              onSearchSymbol={() => setShowSearch(true)}
            />
            
            <div className="flex-1 flex flex-col min-h-0 relative">
              <div className={`flex-1 min-h-0 bg-[#131722] grid gap-[1px] relative overflow-hidden ${
                layout === 4 ? 'grid-cols-1 sm:grid-cols-2 grid-rows-4 sm:grid-rows-2' : 
                layout === 2 ? 'grid-cols-1 sm:grid-cols-2' : 
                'grid-cols-1'
              }`}>
                {Array.from({ length: layout }).map((_, i) => (
                  <div key={i} className="relative border border-[#2a2e39]/30 overflow-hidden">
                    <MainChart key={`${symbol}-${timeframe}-${i}`} layoutIdx={i} timeframe={timeframe} symbol={symbol} price={price} onTrade={handleTrade} />
                  </div>
                ))}
              </div>
              
              <div className="hidden sm:block">
                <RSIPane />
              </div>

              {/* Compact Bottom Modules (Desktop) */}
              <div className="hidden md:flex h-40 border-t border-[#2a2e39] bg-[#131722] shrink-0">
                <div className="w-1/4 border-r border-[#2a2e39]">
                  <Heatmap />
                </div>
                <div className="w-1/4 border-r border-[#2a2e39]">
                  <EconomicCalendar />
                </div>
                <div className="w-1/2">
                  <IdeasFeed />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className={`flex-1 flex flex-col bg-[#131722] sm:hidden ${activeTab === 'Watchlist' ? 'flex' : 'hidden'}`}>
             <Watchlist activeSymbol={symbol} onSelectSymbol={setSymbol} onAddSymbol={() => setShowSearch(true)} />
             <div className="flex-1 border-t border-[#2a2e39] overflow-hidden flex flex-col">
                <OrderBook symbol={symbol} price={price} />
                <TimeAndSales price={price} />
             </div>
          </div>
          
          <div className={`flex-1 flex flex-col bg-[#131722] sm:hidden ${activeTab === 'News' ? 'flex' : 'hidden'}`}>
             <IdeasFeed />
          </div>

          <div className={`flex-1 flex flex-col sm:hidden p-4 ${activeTab === 'Profile' ? 'flex' : 'hidden'}`}>
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#2962ff] rounded-full flex items-center justify-center font-bold">JD</div>
                <div>
                   <p className="font-bold">John Doe</p>
                   <p className="text-[10px] text-gray-500">Pro Account</p>
                </div>
             </div>
             <AccountBalances isLoggedIn={isLoggedIn} />
          </div>
        </div>

        {/* Right Side Stack: Desktop only */}
        <aside className="hidden lg:flex w-[280px] border-l border-[#2a2e39] flex flex-col bg-[#131722] shrink-0">
          <div className="h-[45%] flex flex-col min-h-0">
             <Watchlist activeSymbol={symbol} onSelectSymbol={setSymbol} onAddSymbol={() => setShowSearch(true)} />
          </div>
          <div className="flex-1 flex flex-col min-h-0 border-t border-[#2a2e39] overflow-y-auto custom-scrollbar">
            <OrderBook symbol={symbol} price={price} />
            <DepthChart price={price} />
            <TimeAndSales price={price} />
          </div>
        </aside>
      </main>

      {/* Compact Bottom Nav (Mobile) */}
      <footer className="sm:hidden h-14 bg-[#1e222d] border-t border-[#2a2e39] flex items-center justify-around shrink-0 z-50">
        {[
          { id: 'Chart', icon: <TrendingUp size={20} /> },
          { id: 'Watchlist', icon: <Star size={20} /> },
          { id: 'News', icon: <Globe size={20} /> },
          { id: 'Profile', icon: <User size={20} /> },
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.id ? 'text-[#2962ff]' : 'text-gray-500 hover:text-[#d1d4dc]'}`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.id}</span>
          </button>
        ))}
      </footer>

      {/* Pro Footer (Desktop) */}
      <footer className="hidden sm:flex h-16 border-t border-[#2a2e39] bg-[#131722] items-center px-4 gap-8 shrink-0 relative overflow-hidden">
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-[8px] font-bold text-[#b2b5be] mb-0.5">
            <span>Market Liquidity Pulse</span>
            <span className="text-white">BTC: 52.4% • ETH: 17.2% • SOL: 4.1%</span>
          </div>
          <div className="h-1.5 w-full bg-[#1c212b] rounded-full flex overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '52%' }} className="h-full bg-orange-500" />
            <motion.div initial={{ width: 0 }} animate={{ width: '17%' }} className="h-full bg-[#2962ff]" />
            <motion.div initial={{ width: 0 }} animate={{ width: '4%' }} className="h-full bg-purple-500" />
            <div className="h-full bg-gray-700 flex-1"></div>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 bg-navy-600 rounded-full border border-[#131722] flex items-center justify-center text-[8px] font-bold text-white">IB</div>
            <div className="w-6 h-6 bg-navy-800 rounded-full border border-[#131722] flex items-center justify-center text-[8px] font-bold text-white">WM</div>
          </div>
          <div className="text-[9px] hidden lg:block">
            <p className="italic text-[#b2b5be]">&ldquo;Institutional grade tools for everyone&rdquo;</p>
            <p className="font-bold text-white">InvBank Wealth Management</p>
          </div>
        </div>

        <div className="flex gap-2 grayscale opacity-50 hidden xl:flex">
           <div className="h-4 w-12 bg-white/20 rounded"></div>
           <div className="h-4 w-12 bg-white/20 rounded"></div>
        </div>

        {/* Footer CTA (Desktop only) */}
        <div className="absolute inset-y-0 right-0 w-80 bg-[#2962ff] hidden xl:flex items-center px-4 gap-3">
           <div className="flex-1">
             <div className="text-[10px] font-bold text-white">Join 50M+ traders today</div>
             <input type="text" placeholder="Email address" className="w-full mt-0.5 bg-white/10 border border-white/20 rounded px-2 py-0.5 text-[9px] text-white placeholder-white/40 focus:outline-none focus:bg-white/20" />
           </div>
           <button className="bg-white text-[#2962ff] font-bold text-[10px] px-3 py-2 rounded shadow-lg whitespace-nowrap hover:scale-[1.02] transition-transform">Start Free</button>
           <X size={14} className="text-white/50 cursor-pointer hover:text-white" />
        </div>
      </footer>

      {/* Hidden legacy sections for now to maintain layout but will be integrated or kept in background */}
      <div className="hidden">
        <PineEditor />
        <BrokerSection />
        <MobileSection />
        <Testimonials />
        <StickyBottomCTA />
        <TopMoversStrip />
      </div>

      <AnimatePresence>
        {showIndicators && <IndicatorSearch onClose={() => setShowIndicators(false)} />}
        {showSearch && <SymbolSearch onClose={() => setShowSearch(false)} onSelect={handleSelectSymbol} />}
      </AnimatePresence>
    </div>
  );
}

// 19. Top Movers Strip
const TopMoversStrip = () => {
  const [tab, setTab] = useState('Gainers');
  const items = [
    { symbol: 'PLTR', price: '24.52', change: '+8.4%' },
    { symbol: 'SMCI', price: '924.12', change: '+12.1%' },
    { symbol: 'MSTR', price: '1642.50', change: '+7.2%' },
    { symbol: 'COIN', price: '245.10', change: '+5.4%' },
    { symbol: 'ARM', price: '128.22', change: '+4.1%' },
  ];
  return (
    <section className="bg-[#131722] border-t border-[#2a2e39] py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-8 border-b border-[#2a2e39] mb-6">
          {['Gainers', 'Losers', 'Most Active'].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)}
              className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors relative ${tab === t ? 'text-[#2962ff]' : 'text-gray-500 hover:text-white'}`}
            >
              {t}
              {tab === t && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2962ff]" />}
            </button>
          ))}
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {items.map(item => (
            <div key={item.symbol} className="min-w-[180px] bg-[#1e222d] border border-[#2a2e39] p-4 rounded-xl flex items-center justify-between hover:border-[#2962ff]/50 transition-colors cursor-pointer group">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#d1d4dc] group-hover:text-[#2962ff] transition-colors">{item.symbol}</span>
                <span className="text-[10px] text-gray-500">NASDAQ</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-mono text-[#d1d4dc]">{item.price}</span>
                <span className="text-[10px] font-bold text-[#089981]">{item.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
