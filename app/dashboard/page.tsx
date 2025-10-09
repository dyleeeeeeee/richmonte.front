"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { accountAPI, transactionAPI, cardAPI, Account, Transaction } from "@/lib/api";
import { ArrowUpRight, ArrowDownLeft, CreditCard, Send, Plus, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [accountsRes, transactionsRes, cardsRes] = await Promise.all([
        accountAPI.getAccounts(),
        transactionAPI.getTransactions(),
        cardAPI.getCards(),
      ]);

      if (accountsRes.data) setAccounts(accountsRes.data);
      if (transactionsRes.data) setTransactions(transactionsRes.data.slice(0, 5));
      if (cardsRes.data) setCards(cardsRes.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 sm:space-y-8">
          {/* Header - Mobile Optimized */}
          <div className="px-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-1 sm:mb-2">Private Vault</h1>
            <p className="text-sm sm:text-base text-neutral-600">Concierge Bank • A Richemont Financial Institution</p>
          </div>

          {/* Total Balance Card - Mobile Optimized */}
          <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl p-6 sm:p-8 text-dark-900 shadow-xl">
            <p className="text-xs sm:text-sm font-medium opacity-80 mb-2">Portfolio Valuation</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <TrendingUp size={16} className="flex-shrink-0" />
              <span>+2.5% this quarter</span>
            </div>
          </div>

          {/* Quick Actions - Mobile Optimized */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => router.push("/dashboard/transfers")}
              className="p-4 sm:p-6 bg-dark-800/50 border border-gold-500/20 rounded-xl hover:border-gold-500/60 transition-all active:scale-95 group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gold-500/30 transition-colors">
                <Send className="text-gold-500" size={20} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-0.5 sm:mb-1">Transfer</h3>
              <p className="text-[10px] sm:text-xs text-gray-400">Execute transfer</p>
            </button>

            <button
              onClick={() => router.push("/dashboard/bills")}
              className="p-4 sm:p-6 bg-dark-800/50 border border-gold-500/20 rounded-xl hover:border-gold-500/60 transition-all active:scale-95 group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gold-500/30 transition-colors">
                <ArrowUpRight className="text-gold-500" size={20} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-0.5 sm:mb-1">Settlements</h3>
              <p className="text-[10px] sm:text-xs text-gray-400">Pay obligations</p>
            </button>

            <button
              onClick={() => router.push("/dashboard/cards")}
              className="p-4 sm:p-6 bg-dark-800/50 border border-gold-500/20 rounded-xl hover:border-gold-500/60 transition-all active:scale-95 group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gold-500/30 transition-colors">
                <CreditCard className="text-gold-500" size={20} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-0.5 sm:mb-1">Cards</h3>
              <p className="text-[10px] sm:text-xs text-gray-400">Your collection</p>
            </button>

            <button
              onClick={() => router.push("/dashboard/accounts?action=new")}
              className="p-4 sm:p-6 bg-dark-800/50 border border-gold-500/20 rounded-xl hover:border-gold-500/60 transition-all active:scale-95 group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gold-500/30 transition-colors">
                <Plus className="text-gold-500" size={20} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold mb-0.5 sm:mb-1">New Vault</h3>
              <p className="text-[10px] sm:text-xs text-gray-400">Open account</p>
            </button>
          </div>

          {/* Accounts Overview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-bold">Private Accounts</h2>
              <button
                onClick={() => router.push("/dashboard/accounts")}
                className="text-sm text-gold-500 hover:text-gold-400 transition-colors"
              >
                View All
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {accounts.length === 0 ? (
                <div className="col-span-3 p-8 bg-dark-800/30 border border-gold-500/10 rounded-xl text-center">
                  <p className="text-gray-400 mb-4">Begin your wealth journey</p>
                  <button
                    onClick={() => router.push("/dashboard/accounts?action=new")}
                    className="px-6 py-2 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-semibold hover:from-gold-500 hover:to-gold-600 transition-colors shadow-md"
                  >
                    Open Private Vault
                  </button>
                </div>
              ) : (
                accounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-6 bg-dark-800/50 border border-gold-500/20 rounded-xl hover:border-gold-500/40 transition-all cursor-pointer"
                    onClick={() => router.push(`/dashboard/accounts/${account.id}`)}
                  >
                    <p className="text-sm text-gray-400 mb-2">{account.account_type}</p>
                    <p className="text-2xl font-bold">${account.balance.toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-bold">Recent Activity</h2>
              <button
                onClick={() => router.push("/dashboard/accounts")}
                className="text-sm text-gold-500 hover:text-gold-400 transition-colors"
              >
                View All
              </button>
            </div>
            <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl overflow-hidden">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No activity recorded</div>
              ) : (
                <div className="divide-y divide-gold-500/10">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 hover:bg-dark-800/50 transition-colors flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          tx.type === "credit" ? "bg-green-500/20" : "bg-red-500/20"
                        }`}>
                          {tx.type === "credit" ? (
                            <ArrowDownLeft className="text-green-500" size={20} />
                          ) : (
                            <ArrowUpRight className="text-red-500" size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tx.description || tx.merchant}</p>
                          <p className="text-sm text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className={`font-semibold ${tx.type === "credit" ? "text-green-500" : "text-red-500"}`}>
                        {tx.type === "credit" ? "+" : "-"}${Math.abs(tx.amount).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cards Summary */}
          {cards.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-bold">Card Collection</h2>
                <button
                  onClick={() => router.push("/dashboard/cards")}
                  className="text-sm text-gold-500 hover:text-gold-400 transition-colors"
                >
                  Manage
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="p-6 bg-gradient-to-br from-dark-800 to-dark-700 border border-gold-500/20 rounded-xl"
                  >
                    <p className="text-sm text-gray-400 mb-4">{card.card_type} • {card.card_brand}</p>
                    <p className="text-lg font-mono mb-4">•••• {card.card_number?.slice(-4)}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Balance</span>
                      <span className="font-semibold">${card.balance?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
