"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { accountAPI, Account } from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";
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
  const { showNotification } = useNotification();

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
        showNotification("Account created successfully! Check your email for confirmation.", "success");
      } else if (response.error) {
        showNotification(`Error: ${response.error}`, "error");
      }
    } catch (error) {
      showNotification("Failed to create account", "error");
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
              <h1 className="text-2xl sm:text-3xl font-work-sans font-bold mb-1 sm:mb-2 text-neutral-900">Accounts</h1>
              <p className="text-sm sm:text-base text-neutral-600 font-gruppo">Manage your banking accounts</p>
            </div>
            <button
              onClick={() => setShowNewAccountModal(true)}
              className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth flex-shrink-0 text-sm sm:text-base active:scale-95 shadow-lg shadow-gold-500/20 hover-glow"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Open New Account</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {/* Accounts Grid */}
          {accounts.length === 0 ? (
            <div className="p-12 glass rounded-xl text-center shadow-lg animate-scale-in">
              <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-gold-600" size={32} />
              </div>
              <h3 className="text-xl font-work-sans font-semibold mb-2 text-neutral-900">No accounts yet</h3>
              <p className="text-neutral-600 font-gruppo mb-6">Open your first account to get started with Concierge Bank</p>
              <button
                onClick={() => setShowNewAccountModal(true)}
                className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth shadow-lg shadow-gold-500/20 hover-glow"
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
                  className="p-6 glass hover:glass-gold rounded-xl border border-gold-500/20 hover:border-gold-500/60 transition-smooth cursor-pointer hover-lift group shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center group-hover:bg-gold-500/30 transition-colors">
                      {getAccountIcon(account.account_type)}
                    </div>
                    <ChevronRight className="text-gray-400 group-hover:text-gold-500 transition-colors" size={20} />
                  </div>
                  <h3 className="text-xl font-work-sans font-semibold mb-2 text-neutral-900">{account.account_type}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(account.account_number);
                      showNotification('Account number copied to clipboard', 'success');
                    }}
                    className="text-sm text-neutral-600 font-gruppo mb-4 hover:text-gold-500 transition-colors group"
                    title="Click to copy full account number"
                  >
                    •••• {account.account_number?.slice(-4)}
                    <span className="ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">📋</span>
                  </button>
                  <div className="border-t border-gold-500/20 pt-4">
                    <p className="text-sm text-neutral-600 font-gruppo mb-1">Current Balance</p>
                    <p className="text-3xl font-work-sans font-bold text-neutral-900">${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Promo Section */}
          <div className="glass-gold rounded-xl p-8 shadow-lg hover-lift border border-gold-500/30">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-600 to-gold-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-work-sans font-semibold mb-2 text-neutral-900">High-Yield Savings</h3>
                <p className="text-neutral-700 font-gruppo mb-4">
                  Earn 4.5% APY on your savings with no minimum balance. Open a savings account today and watch your wealth grow.
                </p>
                <button
                  onClick={() => {
                    setNewAccountType("Savings");
                    setShowNewAccountModal(true);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth shadow-md active:scale-95"
                >
                  Open Savings Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* New Account Modal */}
        {showNewAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md glass-gold border border-gold-500/30 rounded-2xl p-8 shadow-2xl animate-scale-in">
              <h2 className="text-2xl font-work-sans font-bold mb-6 text-neutral-900">Open New Account</h2>
              <form onSubmit={handleCreateAccount} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-900">Account Type</label>
                  <select
                    value={newAccountType}
                    onChange={(e) => setNewAccountType(e.target.value)}
                    className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 shadow-inner"
                  >
                    <option value="Checking" className="text-neutral-900">Checking Account</option>
                    <option value="Savings" className="text-neutral-900">Savings Account</option>
                    <option value="Investment" className="text-neutral-900">Investment Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-900">Initial Deposit (Optional)</label>
                  <input
                    type="number"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                  />
                </div>

                <div className="bg-gold-500/10 border border-gold-500/20 rounded-lg p-4">
                  <p className="text-sm text-neutral-700 font-gruppo">
                    {newAccountType === "Checking" && "Perfect for everyday transactions. No monthly fees."}
                    {newAccountType === "Savings" && "Earn 4.5% APY with no minimum balance requirement."}
                    {newAccountType === "Investment" && "Build your wealth with diversified portfolios."}
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNewAccountModal(false)}
                    className="flex-1 px-6 py-3 glass text-neutral-700 rounded-lg font-work-sans font-semibold hover:glass-gold transition-smooth shadow-md active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth disabled:opacity-50 shadow-lg shadow-gold-500/20 active:scale-95"
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
