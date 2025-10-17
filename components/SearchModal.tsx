"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Wallet,
  Receipt,
  Users,
  Bell,
  FileText,
  Clock,
  Hash,
  DollarSign,
  TrendingUp,
  Target,
  Calendar,
  Building2,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";
import { searchAPI, SearchResult as APISearchResult } from "@/lib/api";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Local interface that extends API SearchResult with ReactNode icon
interface LocalSearchResult extends Omit<APISearchResult, 'icon'> {
  icon: React.ReactNode;
}

// Helper function to get icon component for result
const getIconForResult = (result: APISearchResult): React.ReactNode => {
  switch (result.icon) {
    case 'wallet':
      return <Wallet className="text-blue-500" size={18} />;
    case 'arrow_up_right':
      return <ArrowUpRight className="text-red-500" size={18} />;
    case 'arrow_down_left':
      return <ArrowDownLeft className="text-green-500" size={18} />;
    case 'credit_card':
      return <CreditCard className="text-purple-500" size={18} />;
    case 'receipt':
      return <Receipt className="text-orange-500" size={18} />;
    case 'users':
      return <Users className="text-indigo-500" size={18} />;
    case 'bell':
      return <Bell className="text-yellow-500" size={18} />;
    case 'trending_up':
      return <TrendingUp className="text-green-500" size={18} />;
    default:
      return <Search size={18} className="text-neutral-500" />;
  }
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const recent = localStorage.getItem('bank_recent_searches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  const handleResultClick = useCallback((result: LocalSearchResult) => {
    router.push(result.href);
    onClose();
  }, [router, onClose]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await searchAPI.globalSearch(searchQuery);
      if (response.data) {
        // Transform backend results to frontend format
        const transformedResults = response.data.results.map((result: APISearchResult) => ({
          ...result,
          icon: getIconForResult(result)
        }));
        setResults(transformedResults);
      }

      // Save to recent searches
      const updatedRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem('bank_recent_searches', JSON.stringify(updatedRecent));

    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [recentSearches]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleResultClick(results[selectedIndex]);
          } else if (query.trim()) {
            performSearch(query);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, query, handleResultClick, onClose, performSearch]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'completed':
      case 'paid':
        return 'text-green-500';
      case 'pending':
      case 'processing':
        return 'text-yellow-500';
      case 'locked':
      case 'blocked':
      case 'failed':
        return 'text-red-500';
      case 'expired':
        return 'text-gray-500';
      default:
        return 'text-neutral-600';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'completed':
      case 'paid':
        return <CheckCircle size={14} />;
      case 'pending':
      case 'processing':
        return <Clock size={14} />;
      case 'locked':
      case 'blocked':
      case 'failed':
        return <AlertCircle size={14} />;
      default:
        return <Info size={14} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[10vh] left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200/60 overflow-hidden">
              {/* Header */}
              <div className="flex items-center px-6 py-4 border-b border-neutral-200/60">
                <Search className="text-neutral-400 mr-3" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search accounts, transactions, cards, bills..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 text-lg placeholder-neutral-400 border-0 outline-none bg-transparent"
                />
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <X size={18} className="text-neutral-500" />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-96 overflow-y-auto">
                {query.trim() === "" ? (
                  /* Recent Searches */
                  <div className="p-4">
                    {recentSearches.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-neutral-700 mb-3 font-work-sans">Recent Searches</h3>
                        <div className="space-y-1">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => setQuery(search)}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors flex items-center space-x-2"
                            >
                              <Clock size={14} className="text-neutral-400" />
                              <span className="text-neutral-700 font-gruppo">{search}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-700 mb-3 font-work-sans">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "New Transfer", icon: <ArrowUpRight size={16} />, action: () => router.push('/dashboard/transfers') },
                          { label: "View Accounts", icon: <Wallet size={16} />, action: () => router.push('/dashboard/accounts') },
                          { label: "Pay Bills", icon: <Receipt size={16} />, action: () => router.push('/dashboard/bills') },
                          { label: "Manage Cards", icon: <CreditCard size={16} />, action: () => router.push('/dashboard/cards') },
                        ].map((action, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              action.action();
                              onClose();
                            }}
                            className="p-3 rounded-lg border border-neutral-200 hover:border-gold-500/30 hover:bg-gold-50 transition-colors text-left flex items-center space-x-3 group"
                          >
                            <div className="text-gold-600 group-hover:text-gold-700">
                              {action.icon}
                            </div>
                            <span className="text-sm font-work-sans font-medium text-neutral-700 group-hover:text-neutral-900">
                              {action.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : loading ? (
                  /* Loading State */
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-neutral-600 font-gruppo">Searching...</span>
                  </div>
                ) : results.length > 0 ? (
                  /* Search Results */
                  <div className="divide-y divide-neutral-100">
                    {results.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className={`w-full text-left px-6 py-4 hover:bg-neutral-50 transition-colors flex items-center space-x-4 ${
                          index === selectedIndex ? 'bg-gold-50 border-l-4 border-l-gold-500' : ''
                        }`}
                      >
                        {/* Icon */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                          {result.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-work-sans font-semibold text-neutral-900 truncate">
                              {result.title}
                            </h4>
                            {result.amount !== undefined && (
                              <span className={`font-mono font-semibold ${
                                result.type === 'transaction' && result.amount < 0 ? 'text-red-500' : 'text-neutral-900'
                              }`}>
                                {result.type === 'transaction' && result.amount < 0 ? '-' : ''}
                                ${Math.abs(result.amount).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-600 truncate font-gruppo">
                            {result.subtitle}
                          </p>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full font-work-sans">
                              {result.category}
                            </span>
                            {result.status && (
                              <span className={`text-xs flex items-center space-x-1 ${getStatusColor(result.status)}`}>
                                {getStatusIcon(result.status)}
                                <span className="font-work-sans capitalize">{result.status}</span>
                              </span>
                            )}
                            {result.date && (
                              <span className="text-xs text-neutral-500 flex items-center space-x-1">
                                <Calendar size={10} />
                                <span className="font-gruppo">{result.date}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <ArrowUpRight size={16} className="text-neutral-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : query.trim() !== "" ? (
                  /* No Results */
                  <div className="flex flex-col items-center justify-center py-12 px-6">
                    <Search className="text-neutral-300 mb-4" size={48} />
                    <h3 className="text-lg font-work-sans font-semibold text-neutral-700 mb-2">
                      No results found
                    </h3>
                    <p className="text-neutral-600 text-center font-gruppo">
                      Try searching for accounts, transactions, cards, bills, or beneficiaries
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Mock search API - replace with real API calls
async function mockSearchAPI(query: string): Promise<LocalSearchResult[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  const mockResults: LocalSearchResult[] = [
    // Mock accounts
    {
      id: 'acc_1',
      type: 'account',
      title: 'Primary Checking Account',
      subtitle: '••••1234',
      amount: 15420.50,
      status: 'active',
      href: '/dashboard/accounts/acc_1',
      icon: <Wallet className="text-blue-500" size={18} />,
      category: 'Checking',
      priority: 1
    },
    {
      id: 'acc_2',
      type: 'account',
      title: 'Savings Account',
      subtitle: 'High-yield • 4.5% APY',
      amount: 45230.00,
      status: 'active',
      href: '/dashboard/accounts/acc_2',
      icon: <TrendingUp className="text-green-500" size={18} />,
      category: 'Savings',
      priority: 2
    },

    // Mock transactions
    {
      id: 'tx_1',
      type: 'transaction',
      title: 'Amazon Purchase',
      subtitle: 'Electronics purchase',
      amount: -89.99,
      date: '2 hours ago',
      href: '/dashboard/accounts/acc_1',
      icon: <ArrowUpRight className="text-red-500" size={18} />,
      category: 'Debit',
      priority: 3
    },
    {
      id: 'tx_2',
      type: 'transaction',
      title: 'Salary Deposit',
      subtitle: 'Monthly salary',
      amount: 3200.00,
      date: '1 day ago',
      href: '/dashboard/accounts/acc_1',
      icon: <ArrowDownLeft className="text-green-500" size={18} />,
      category: 'Credit',
      priority: 4
    },

    // Mock cards
    {
      id: 'card_1',
      type: 'card',
      title: 'Platinum Card',
      subtitle: '••••5678',
      status: 'active',
      href: '/dashboard/cards/card_1',
      icon: <CreditCard className="text-purple-500" size={18} />,
      category: 'Credit Card',
      priority: 5
    },

    // Mock bills
    {
      id: 'bill_1',
      type: 'bill',
      title: 'Electricity Bill',
      subtitle: 'ConEdison',
      amount: 125.50,
      status: 'pending',
      date: 'Due in 3 days',
      href: '/dashboard/bills/bill_1',
      icon: <Receipt className="text-orange-500" size={18} />,
      category: 'Utilities',
      priority: 6
    },

    // Mock beneficiaries
    {
      id: 'ben_1',
      type: 'beneficiary',
      title: 'John Smith',
      subtitle: 'Brother • 25% allocation',
      href: '/dashboard/settings/beneficiaries',
      icon: <Users className="text-indigo-500" size={18} />,
      category: 'Beneficiary',
      priority: 7
    }
  ];

  // Filter and sort results based on query
  return mockResults
    .filter(result =>
      result.title.toLowerCase().includes(query) ||
      result.subtitle.toLowerCase().includes(query) ||
      result.category.toLowerCase().includes(query) ||
      result.type.toLowerCase().includes(query)
    )
    .sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.title.toLowerCase().includes(query);
      const bExact = b.title.toLowerCase().includes(query);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      // Then by priority
      return (a.priority || 0) - (b.priority || 0);
    })
    .slice(0, 8); // Limit to 8 results
}
