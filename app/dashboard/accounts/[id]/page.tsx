"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { accountAPI, Transaction, Account } from "@/lib/api";
import { ArrowUpRight, ArrowDownLeft, Download, Filter, Search } from "lucide-react";

export const runtime = 'edge';

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const loadAccountData = useCallback(async () => {
    // Clear stale data immediately to prevent showing wrong account's transactions
    setTransactions([]);
    setAccount(null);
    
    try {
      const [accountsRes, transactionsRes] = await Promise.all([
        accountAPI.getAccounts(),
        accountAPI.getAccountTransactions(params.id as string),
      ]);

      if (accountsRes.data) {
        const acc = accountsRes.data.find((a: Account) => a.id === params.id);
        setAccount(acc || null);
      }

      // Always set transactions, even if empty or undefined
      setTransactions(transactionsRes.data || []);
    } catch (error) {
      console.error("Failed to load account:", error);
      // Ensure transactions are cleared on error
      setTransactions([]);
      setAccount(null);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      loadAccountData();
    }
  }, [params.id, loadAccountData]);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === "all" || tx.type === filterType;
    const matchesSearch =
      searchTerm === "" ||
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.merchant?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ["Date", "Type", "Description", "Amount"];
    const rows = filteredTransactions.map((tx) => [
      new Date(tx.created_at).toLocaleDateString(),
      tx.type,
      tx.description || tx.merchant || "",
      tx.amount.toFixed(2),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${account?.account_number}.csv`;
    a.click();
  };

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

  if (!account) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Account not found</h2>
            <button
              onClick={() => router.push("/dashboard/accounts")}
              className="px-6 py-3 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400"
            >
              Back to Accounts
            </button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Account Header */}
          <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl p-8 text-dark-900">
            <button
              onClick={() => router.push("/dashboard/accounts")}
              className="text-sm mb-4 opacity-80 hover:opacity-100"
            >
              ← Back to Accounts
            </button>
            <h1 className="text-4xl font-serif font-bold mb-2">{account.account_type} Account</h1>
            <div className="mb-6 space-y-1">
              <p className="text-lg opacity-90">Account ••••{account.account_number?.slice(-4)}</p>
              <p className="text-sm opacity-75">
                Routing Number: {account.routing_number || '121000248'}
                <span className="text-xs block text-gold-200 mt-1">
                  Wells Fargo Bank N.A. - Our US partner bank for clearing and settlement services
                </span>
              </p>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-sm opacity-80">Current Balance</span>
              <h2 className="text-5xl font-bold">
                ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push(`/dashboard/transfers?from=${account.id}`)}
              className="p-4 bg-dark-800/50 border border-gold-500/20 rounded-xl hover:border-gold-500/60 transition-all text-center"
            >
              <ArrowUpRight className="mx-auto mb-2 text-gold-500" size={24} />
              <p className="font-semibold text-sm">Transfer</p>
            </button>
            <button
              onClick={() => router.push(`/dashboard/bills?account=${account.id}`)}
              className="p-4 bg-dark-800/50 border border-gold-500/20 rounded-xl hover:border-gold-500/60 transition-all text-center"
            >
              <ArrowDownLeft className="mx-auto mb-2 text-gold-500" size={24} />
              <p className="font-semibold text-sm">Pay Bill</p>
            </button>
            <button
              onClick={exportToCSV}
              className="p-4 bg-dark-800/50 border border-gold-500/20 rounded-xl hover:border-gold-500/60 transition-all text-center"
            >
              <Download className="mx-auto mb-2 text-gold-500" size={24} />
              <p className="font-semibold text-sm">Export</p>
            </button>
            <button
              onClick={() => router.push(`/dashboard/statements?account=${account.id}`)}
              className="p-4 bg-dark-800/50 border border-gold-500/20 rounded-xl hover:border-gold-500/60 transition-all text-center"
            >
              <Filter className="mx-auto mb-2 text-gold-500" size={24} />
              <p className="font-semibold text-sm">Statements</p>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-800/50 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 text-white placeholder:text-gray-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-dark-800/50 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 text-white"
            >
              <option value="all" className="text-white">All Transactions</option>
              <option value="credit" className="text-white">Credits Only</option>
              <option value="debit" className="text-white">Debits Only</option>
            </select>
          </div>

          {/* Transactions Table */}
          <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-800/50 border-b border-gold-500/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-500/10">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-dark-800/30 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {new Date(tx.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                tx.type === "credit" ? "bg-green-500/20" : "bg-red-500/20"
                              }`}
                            >
                              {tx.type === "credit" ? (
                                <ArrowDownLeft className="text-green-500" size={18} />
                              ) : (
                                <ArrowUpRight className="text-red-500" size={18} />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{tx.description || tx.merchant || "Transaction"}</p>
                              <p className="text-xs text-gray-400">{tx.merchant}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {tx.category || "Uncategorized"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`font-semibold ${
                              tx.type === "credit" ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {tx.type === "credit" ? "+" : "-"}$
                            {Math.abs(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
