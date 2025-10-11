"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import AnimatedCard from "@/components/AnimatedCard";
import AnimatedButton from "@/components/AnimatedButton";
import { accountAPI, cardAPI, Account, Transaction } from "@/lib/api";
import { ArrowUpRight, ArrowDownLeft, CreditCard, Send, Plus, TrendingUp } from "lucide-react";
import { containerVariants, itemVariants, glassRevealVariants } from "@/lib/animations";

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
      const [accountsRes, cardsRes] = await Promise.all([
        accountAPI.getAccounts(),
        cardAPI.getCards(),
      ]);

      if (accountsRes.data) {
        setAccounts(accountsRes.data);
        
        // Load transactions from first account if available
        if (accountsRes.data.length > 0) {
          const txRes = await accountAPI.getAccountTransactions(accountsRes.data[0].id);
          if (txRes.data) setTransactions(txRes.data.slice(0, 5));
        }
      }
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
        <PageTransition>
          <motion.div 
            className="space-y-6 sm:space-y-8"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
          {/* Header - Mobile Optimized */}
          <div className="px-1">
            <h1 className="text-2xl sm:text-3xl font-work-sans font-bold text-neutral-900 mb-1 sm:mb-2">Private Vault</h1>
            <p className="text-sm sm:text-base text-neutral-600 font-gruppo">Concierge Bank • A Richemont Financial Institution</p>
          </div>

          {/* Total Balance Card - Light Glassmorphism */}
          <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl shadow-gold-500/20">
            <p className="text-xs sm:text-sm font-work-sans font-medium opacity-80 mb-2">Portfolio Valuation</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-work-sans font-bold mb-4 sm:mb-6">
              ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <TrendingUp size={16} className="flex-shrink-0" />
              <span>+2.5% this quarter</span>
            </div>
          </div>

          {/* Quick Actions - Animated */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
            variants={containerVariants}
          >
            <AnimatedButton
              onClick={() => router.push("/dashboard/transfers")}
              className="p-4 sm:p-6 bg-white/40 backdrop-blur-sm border border-neutral-200/60 rounded-xl hover:bg-white/60 hover:border-gold-500/40 hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gold-500/20 transition-colors">
                <Send className="text-gold-600" size={20} />
              </div>
              <h3 className="text-sm sm:text-base font-work-sans font-semibold text-neutral-900 mb-0.5 sm:mb-1">Transfer</h3>
              <p className="text-[10px] sm:text-xs text-neutral-600 font-gruppo">Execute transfer</p>
            </AnimatedButton>

            <AnimatedButton
              onClick={() => router.push("/dashboard/bills")}
              className="p-4 sm:p-6 bg-white/40 backdrop-blur-sm border border-neutral-200/60 rounded-xl hover:bg-white/60 hover:border-gold-500/40 hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gold-500/20 transition-colors">
                <ArrowUpRight className="text-gold-600" size={20} />
              </div>
              <h3 className="text-sm sm:text-base font-work-sans font-semibold text-neutral-900 mb-0.5 sm:mb-1">Settlements</h3>
              <p className="text-[10px] sm:text-xs text-neutral-600 font-gruppo">Pay obligations</p>
            </AnimatedButton>

            <AnimatedButton
              onClick={() => router.push("/dashboard/cards")}
              className="p-4 sm:p-6 bg-white/40 backdrop-blur-sm border border-neutral-200/60 rounded-xl hover:bg-white/60 hover:border-gold-500/40 hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gold-500/20 transition-colors">
                <CreditCard className="text-gold-600" size={20} />
              </div>
              <h3 className="text-sm sm:text-base font-work-sans font-semibold text-neutral-900 mb-0.5 sm:mb-1">Cards</h3>
              <p className="text-[10px] sm:text-xs text-neutral-600 font-gruppo">Your collection</p>
            </AnimatedButton>

            <AnimatedButton
              onClick={() => router.push("/dashboard/accounts?action=new")}
              className="p-4 sm:p-6 bg-white/40 backdrop-blur-sm border border-neutral-200/60 rounded-xl hover:bg-white/60 hover:border-gold-500/40 hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gold-500/20 transition-colors">
                <Plus className="text-gold-600" size={20} />
              </div>
              <h3 className="text-sm sm:text-base font-work-sans font-semibold text-neutral-900 mb-0.5 sm:mb-1">New Vault</h3>
              <p className="text-[10px] sm:text-xs text-neutral-600 font-gruppo">Open account</p>
            </AnimatedButton>
          </motion.div>

          {/* Accounts Overview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-work-sans font-bold text-neutral-900">Private Accounts</h2>
              <button
                onClick={() => router.push("/dashboard/accounts")}
                className="text-sm text-gold-600 hover:text-gold-700 font-gruppo transition-colors"
              >
                View All
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {accounts.length === 0 ? (
                <div className="col-span-3 p-8 bg-white/40 backdrop-blur-xl border border-neutral-200/60 rounded-xl text-center">
                  <p className="text-neutral-600 mb-4 font-gruppo">Begin your wealth journey</p>
                  <button
                    onClick={() => router.push("/dashboard/accounts?action=new")}
                    className="px-6 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-work-sans font-semibold hover:from-gold-600 hover:to-gold-700 transition-colors shadow-lg shadow-gold-500/20"
                  >
                    Open Private Vault
                  </button>
                </div>
              ) : (
                accounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-6 bg-white/40 backdrop-blur-sm border border-neutral-200/60 rounded-xl hover:bg-white/60 hover:border-gold-500/40 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => router.push(`/dashboard/accounts/${account.id}`)}
                  >
                    <p className="text-sm text-neutral-600 mb-2 font-gruppo">{account.account_type}</p>
                    <p className="text-2xl font-work-sans font-bold text-neutral-900">${account.balance.toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-work-sans font-bold text-neutral-900">Recent Activity</h2>
              <button
                onClick={() => router.push("/dashboard/accounts")}
                className="text-sm text-gold-600 hover:text-gold-700 transition-colors font-gruppo"
              >
                View All
              </button>
            </div>
            <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/60 rounded-xl overflow-hidden">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-neutral-600 font-gruppo">No activity recorded</div>
              ) : (
                <div className="divide-y divide-neutral-200/60">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 hover:bg-white/60 transition-colors flex items-center justify-between">
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
                          <p className="font-work-sans font-medium text-neutral-900">{tx.description || tx.merchant}</p>
                          <p className="text-sm text-neutral-600 font-gruppo">{new Date(tx.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className={`font-work-sans font-semibold ${tx.type === "credit" ? "text-green-500" : "text-red-500"}`}>
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
                <h2 className="text-xl font-work-sans font-bold">Card Collection</h2>
                <button
                  onClick={() => router.push("/dashboard/cards")}
                  className="text-sm text-gold-500 hover:text-gold-400 transition-colors font-gruppo"
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
                    <p className="text-sm text-gray-400 mb-4 font-gruppo">{card.card_type} • {card.card_brand}</p>
                    <p className="text-lg font-mono mb-4">•••• {card.card_number?.slice(-4)}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 font-gruppo">Balance</span>
                      <span className="font-work-sans font-semibold">${card.balance?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </motion.div>
        </PageTransition>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
