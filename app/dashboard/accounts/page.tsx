"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { accountAPI, Account } from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";
import { Plus, ChevronRight, TrendingUp, Wallet, Copy, Sparkles, ArrowUpRight, Landmark } from "lucide-react";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [newAccountType, setNewAccountType] = useState("Checking");
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
      });

      if (response.data) {
        setAccounts([...accounts, response.data]);
        setShowNewAccountModal(false);
        setNewAccountType("Checking");
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

  const getAccountMeta = (type: string) => {
    switch (type) {
      case "Savings":
        return { icon: <TrendingUp size={20} />, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
      case "Investment":
        return { icon: <TrendingUp size={20} />, color: "text-navy-700", bg: "bg-navy-50", border: "border-navy-200" };
      default:
        return { icon: <Wallet size={20} />, color: "text-navy-700", bg: "bg-navy-50", border: "border-navy-200" };
    }
  };

  function fmtMoney(n: number): string {
    return n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function BentoCard({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={onClick}
        className={`relative bg-white border border-light-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${onClick ? "hover:border-navy-700/40" : ""} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const savingsCount = accounts.filter((account) => account.account_type === "Savings").length;
  const investmentCount = accounts.filter((account) => account.account_type === "Investment").length;

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-navy-700 border-t-transparent rounded-full animate-spin" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <BentoCard className="overflow-hidden border-navy-800 bg-gradient-to-br from-navy-900 via-navy-900 to-navy-800 text-white p-0">
            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-work-sans font-bold tracking-[0.16em] uppercase text-navy-200/80">
                    Capital architecture
                  </p>
                  <h1 className="mt-2 text-3xl sm:text-4xl font-work-sans font-bold tracking-tight">
                    Accounts built like a portfolio wall.
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-navy-100/75 font-gruppo max-w-xl">
                    Scan every balance, spot your cash mix, and open new account types from a cleaner control surface.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowNewAccountModal(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-navy-900 hover:bg-navy-50 font-work-sans font-semibold text-sm transition-colors"
                  >
                    <Plus size={18} />
                    <span>Open Account</span>
                  </button>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 min-w-[160px]">
                    <p className="text-[10px] font-work-sans font-bold tracking-[0.16em] uppercase text-navy-200/75">Total held</p>
                    <p className="mt-1 text-2xl font-work-sans font-bold tabular-nums">{fmtMoney(totalBalance)}</p>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BentoCard className="p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-work-sans font-bold tracking-[0.12em] uppercase text-neutral-500">Live accounts</p>
                  <p className="mt-2 text-3xl font-work-sans font-bold text-neutral-900">{accounts.length}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center">
                  <Landmark size={20} />
                </div>
              </div>
            </BentoCard>
            <BentoCard className="p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-work-sans font-bold tracking-[0.12em] uppercase text-neutral-500">Savings pods</p>
                  <p className="mt-2 text-3xl font-work-sans font-bold text-neutral-900">{savingsCount}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
              </div>
            </BentoCard>
            <BentoCard className="p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-work-sans font-bold tracking-[0.12em] uppercase text-neutral-500">Investment lanes</p>
                  <p className="mt-2 text-3xl font-work-sans font-bold text-neutral-900">{investmentCount}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </BentoCard>
          </div>

          {accounts.length === 0 ? (
            <BentoCard className="p-12 text-center">
              <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-navy-700" size={32} />
              </div>
              <h3 className="text-xl font-work-sans font-semibold mb-2 text-neutral-900">No accounts yet</h3>
              <p className="text-neutral-500 font-gruppo mb-6">Open your first account to get started with InvBank</p>
              <button
                onClick={() => setShowNewAccountModal(true)}
                className="px-6 py-2.5 bg-navy-700 hover:bg-navy-800 text-white rounded-xl font-work-sans font-semibold transition-colors"
              >
                Open Your First Account
              </button>
            </BentoCard>
          ) : (
            <div className="grid lg:grid-cols-12 gap-4 sm:gap-5">
              <div className="lg:col-span-8 grid md:grid-cols-2 gap-4 sm:gap-5">
                {accounts.map((account) => {
                  const meta = getAccountMeta(account.account_type);
                  return (
                    <BentoCard
                      key={account.id}
                      onClick={() => router.push(`/dashboard/accounts/${account.id}`)}
                      className="group p-5 sm:p-6"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${meta.bg} ${meta.color}`}>
                          {meta.icon}
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400 group-hover:text-navy-700 transition-colors">
                          <span className="text-[10px] font-work-sans font-bold tracking-[0.14em] uppercase text-neutral-400">Details</span>
                          <ChevronRight size={18} />
                        </div>
                      </div>
                      <p className="text-[11px] font-work-sans font-bold tracking-[0.12em] uppercase text-neutral-500 mb-2">{account.account_type}</p>
                      <p className="text-2xl font-work-sans font-bold text-neutral-900 tabular-nums">{fmtMoney(account.balance)}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(account.account_number);
                          showNotification('Account number copied to clipboard', 'success');
                        }}
                        className="mt-4 flex items-center gap-1.5 text-sm text-neutral-500 font-gruppo hover:text-navy-700 transition-colors group"
                        title="Click to copy full account number"
                      >
                        <span>•••• {account.account_number?.slice(-4)}</span>
                        <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-light-200 pt-4">
                        <div className="rounded-xl bg-light-50 px-3 py-3">
                          <p className="text-[10px] font-work-sans font-bold tracking-[0.14em] uppercase text-neutral-500">Status</p>
                          <p className="mt-1 text-sm font-work-sans font-semibold text-neutral-900">Active</p>
                        </div>
                        <div className="rounded-xl bg-light-50 px-3 py-3">
                          <p className="text-[10px] font-work-sans font-bold tracking-[0.14em] uppercase text-neutral-500">Lane</p>
                          <p className="mt-1 text-sm font-work-sans font-semibold text-neutral-900">{account.account_type}</p>
                        </div>
                      </div>
                    </BentoCard>
                  );
                })}
              </div>

              <div className="lg:col-span-4 space-y-4 sm:space-y-5">
                <BentoCard className="p-6 sm:p-7 overflow-hidden border-navy-800 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white">
                  <div className="relative">
                    <div className="pointer-events-none absolute -top-10 -right-8 h-32 w-32 rounded-full bg-sky-400/15 blur-3xl" />
                    <div className="relative">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-5">
                        <TrendingUp className="text-white" size={22} />
                      </div>
                      <h3 className="text-xl font-work-sans font-semibold mb-2">High-Yield Savings</h3>
                      <p className="text-sm text-navy-100/75 font-gruppo mb-5 leading-relaxed">
                        Earn 4.5% APY on your savings with no minimum balance and instant account creation.
                      </p>
                      <button
                        onClick={() => {
                          setNewAccountType("Savings");
                          setShowNewAccountModal(true);
                        }}
                        className="w-full px-5 py-3 bg-white text-navy-900 hover:bg-navy-50 rounded-2xl font-work-sans font-semibold transition-colors text-sm"
                      >
                        Open Savings Account
                      </button>
                    </div>
                  </div>
                </BentoCard>

                <BentoCard className="p-6">
                  <p className="text-[11px] font-work-sans font-bold tracking-[0.12em] uppercase text-neutral-500 mb-4">Why this layout</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center flex-shrink-0">
                        <Wallet size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-work-sans font-semibold text-neutral-900">Fast balance scan</p>
                        <p className="text-xs text-neutral-500 font-gruppo mt-1">Each account card now reads like a compact bento module.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-work-sans font-semibold text-neutral-900">Clear hierarchy</p>
                        <p className="text-xs text-neutral-500 font-gruppo mt-1">Hero totals, metrics, and collection cards now feel distinct and modular.</p>
                      </div>
                    </div>
                  </div>
                </BentoCard>
              </div>
            </div>
          )}
        </div>

        {/* New Account Modal */}
        {showNewAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white border border-light-200 rounded-2xl p-6 sm:p-8 shadow-xl"
            >
              <h2 className="text-xl font-work-sans font-bold mb-6 text-neutral-900">Open New Account</h2>
              <form onSubmit={handleCreateAccount} className="space-y-5">
                <div>
                  <label className="block text-sm font-work-sans font-semibold mb-2 text-neutral-900">Account Type</label>
                  <select
                    value={newAccountType}
                    onChange={(e) => setNewAccountType(e.target.value)}
                    className="w-full px-4 py-3 bg-light-50 border border-light-200 rounded-xl focus:outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20 transition-all text-neutral-900"
                  >
                    <option value="Checking">Checking Account</option>
                    <option value="Savings">Savings Account</option>
                    <option value="Investment">Investment Account</option>
                  </select>
                </div>

                <div className="bg-navy-50 border border-navy-200 rounded-xl p-4">
                  <p className="text-sm text-neutral-700 font-gruppo">
                    {newAccountType === "Checking" && "Perfect for everyday transactions. No monthly fees."}
                    {newAccountType === "Savings" && "Earn 4.5% APY with no minimum balance requirement."}
                    {newAccountType === "Investment" && "Build your wealth with diversified portfolios."}
                    <br /><br />
                    <strong>Note:</strong> All accounts start with a $0.00 balance and are approved instantly.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewAccountModal(false)}
                    className="flex-1 px-5 py-2.5 bg-light-100 hover:bg-light-200 text-neutral-700 rounded-xl font-work-sans font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 px-5 py-2.5 bg-navy-700 hover:bg-navy-800 text-white rounded-xl font-work-sans font-semibold transition-colors disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Open Account"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
