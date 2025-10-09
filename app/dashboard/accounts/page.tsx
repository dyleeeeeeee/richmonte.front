"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { accountAPI, Account } from "@/lib/api";
import { Plus, ChevronRight, TrendingUp, Wallet } from "lucide-react";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [newAccountType, setNewAccountType] = useState("Checking");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    loadAccounts();
    // Check if should open new account modal
    if (searchParams.get("action") === "new") {
      setShowNewAccountModal(true);
    }
  }, [searchParams]);

  const loadAccounts = async () => {
    try {
      const response = await accountAPI.getAccounts();
      if (response.data) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error("Failed to load accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await accountAPI.createAccount({
        account_type: newAccountType,
        initial_deposit: parseFloat(initialDeposit) || 0,
      });

      if (response.data) {
        setAccounts([...accounts, response.data]);
        setShowNewAccountModal(false);
        setNewAccountType("Checking");
        setInitialDeposit("");
        alert("Account created successfully! Check your email for confirmation.");
      } else if (response.error) {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      alert("Failed to create account");
    } finally {
      setCreating(false);
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "Savings":
        return <TrendingUp className="text-green-500" size={24} />;
      case "Investment":
        return <TrendingUp className="text-blue-500" size={24} />;
      default:
        return <Wallet className="text-gold-500" size={24} />;
    }
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

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 sm:space-y-8 pb-4">
          {/* Header - Mobile Optimized */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-1 sm:mb-2">Accounts</h1>
              <p className="text-sm sm:text-base text-gray-400">Manage your banking accounts</p>
            </div>
            <button
              onClick={() => setShowNewAccountModal(true)}
              className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400 transition-colors flex-shrink-0 text-sm sm:text-base active:scale-95"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Open New Account</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {/* Accounts Grid */}
          {accounts.length === 0 ? (
            <div className="p-12 bg-dark-800/30 border border-gold-500/10 rounded-xl text-center">
              <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-gold-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">No accounts yet</h3>
              <p className="text-gray-400 mb-6">Open your first account to get started with Concierge Bank</p>
              <button
                onClick={() => setShowNewAccountModal(true)}
                className="px-8 py-3 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400 transition-colors"
              >
                Open Your First Account
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => router.push(`/dashboard/accounts/${account.id}`)}
                  className="p-6 bg-dark-800/50 border border-gold-500/20 rounded-xl hover:border-gold-500/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center group-hover:bg-gold-500/30 transition-colors">
                      {getAccountIcon(account.account_type)}
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:text-gold-500 transition-colors" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{account.account_type}</h3>
                  <p className="text-sm text-gray-400 mb-4">••••  {account.account_number?.slice(-4)}</p>
                  <div className="border-t border-gold-500/10 pt-4">
                    <p className="text-sm text-gray-400 mb-1">Current Balance</p>
                    <p className="text-3xl font-bold">${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Promo Section */}
          <div className="bg-gradient-to-br from-gold-500/10 to-gold-600/10 border border-gold-500/30 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-dark-900" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">High-Yield Savings</h3>
                <p className="text-gray-300 mb-4">
                  Earn 4.5% APY on your savings with no minimum balance. Open a savings account today and watch your wealth grow.
                </p>
                <button
                  onClick={() => {
                    setNewAccountType("Savings");
                    setShowNewAccountModal(true);
                  }}
                  className="px-6 py-2 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400 transition-colors"
                >
                  Open Savings Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* New Account Modal */}
        {showNewAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="w-full max-w-md bg-dark-800 border border-gold-500/30 rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Open New Account</h2>
              <form onSubmit={handleCreateAccount} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Account Type</label>
                  <select
                    value={newAccountType}
                    onChange={(e) => setNewAccountType(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
                  >
                    <option value="Checking">Checking Account</option>
                    <option value="Savings">Savings Account</option>
                    <option value="Investment">Investment Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Initial Deposit (Optional)</label>
                  <input
                    type="number"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                <div className="bg-dark-900 border border-gold-500/10 rounded-lg p-4">
                  <p className="text-sm text-gray-400">
                    {newAccountType === "Checking" && "Perfect for everyday transactions. No monthly fees."}
                    {newAccountType === "Savings" && "Earn 4.5% APY with no minimum balance requirement."}
                    {newAccountType === "Investment" && "Build your wealth with diversified portfolios."}
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNewAccountModal(false)}
                    className="flex-1 px-6 py-3 bg-dark-700 text-gray-300 rounded-lg font-semibold hover:bg-dark-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 px-6 py-3 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400 transition-colors disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Open Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
