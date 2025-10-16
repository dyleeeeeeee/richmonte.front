"use client";

import { useEffect, useState, FormEvent, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { accountAPI, transferAPI, Account } from "@/lib/api";
import { Send, Calendar, Repeat, User, Building, ArrowRight } from "lucide-react";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function TransfersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transferType, setTransferType] = useState<"internal" | "external" | "p2p">("internal");
  const [formData, setFormData] = useState({
    from_account: "",
    to_account: "",
    to_external_account: "",
    to_external_routing: "",
    to_email: "",
    to_phone: "",
    amount: "",
    description: "",
    recurring: false,
    schedule_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const loadAccounts = useCallback(async () => {
    try {
      const response = await accountAPI.getAccounts();
      if (response.data) {
        const accountsData = response.data;
        setAccounts(accountsData);
        if (accountsData.length > 0 && !formData.from_account) {
          setFormData((prev) => ({ ...prev, from_account: accountsData[0].id }));
        }
      }
    } catch (error) {
      console.error("Failed to load accounts:", error);
    } finally {
      setLoading(false);
    }
  }, [formData.from_account]);

  const loadHistory = useCallback(async () => {
    try {
      // Load transactions from first account if available
      if (accounts.length > 0) {
        const response = await accountAPI.getAccountTransactions(accounts[0].id);
        if (response.data) {
          setHistory(response.data.slice(0, 10));
        }
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  }, [accounts]);

  useEffect(() => {
    loadAccounts();
    
    const fromAccount = searchParams.get("from");
    if (fromAccount) {
      setFormData((prev) => ({ ...prev, from_account: fromAccount }));
    }
  }, [searchParams, loadAccounts]);

  useEffect(() => {
    if (accounts.length > 0) {
      loadHistory();
    }
  }, [accounts, loadHistory]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let transferData: any = {
        from_account_id: formData.from_account,
        amount: parseFloat(formData.amount),
        transfer_type: transferType,
      };

      if (transferType === "internal") {
        transferData.to_account_id = formData.to_account;
      } else if (transferType === "external") {
        transferData.to_external = {
          account_number: formData.to_external_account,
          routing_number: formData.to_external_routing,
        };
      } else {
        transferData.to_external = {
          email: formData.to_email,
          phone: formData.to_phone,
        };
      }

      const response = await transferAPI.createTransfer(transferData);

      if (response.data) {
        alert("Transfer completed successfully!");
        setFormData({
          ...formData,
          amount: "",
          description: "",
          to_account: "",
          to_external_account: "",
          to_external_routing: "",
          to_email: "",
          to_phone: "",
        });
        loadAccounts();
        loadHistory();
      } else if (response.error) {
        alert(`Transfer failed: ${response.error}`);
      }
    } catch (error) {
      alert("Transfer failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAccount = accounts.find((a) => a.id === formData.from_account);

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
          <div className="px-1">
            <h1 className="text-2xl sm:text-3xl font-work-sans font-bold mb-1 sm:mb-2 text-neutral-900">Transfers</h1>
            <p className="text-sm sm:text-base text-neutral-600 font-gruppo">Send money quickly and securely</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Transfer Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Transfer Type Tabs */}
              <div className="glass border border-gold-500/20 rounded-xl p-2 flex space-x-2 shadow-md">
                <button
                  onClick={() => setTransferType("internal")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    transferType === "internal"
                      ? "bg-gradient-to-r from-gold-600 to-gold-700 text-white shadow-md"
                      : "text-neutral-700 hover:glass-gold"
                  }`}
                >
                  <Send size={18} />
                  <span>Internal</span>
                </button>
                <button
                  onClick={() => setTransferType("external")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    transferType === "external"
                      ? "bg-gradient-to-r from-gold-600 to-gold-700 text-white shadow-md"
                      : "text-neutral-700 hover:glass-gold"
                  }`}
                >
                  <Building size={18} />
                  <span>External</span>
                </button>
                <button
                  onClick={() => setTransferType("p2p")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    transferType === "p2p"
                      ? "bg-gradient-to-r from-gold-600 to-gold-700 text-white shadow-md"
                      : "text-neutral-700 hover:glass-gold"
                  }`}
                >
                  <User size={18} />
                  <span>Person to Person</span>
                </button>
              </div>

              {/* Transfer Form */}
              <form onSubmit={handleSubmit} className="glass border border-gold-500/20 rounded-xl p-6 space-y-6 shadow-lg">
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-900">From Account</label>
                  <select
                    value={formData.from_account}
                    onChange={(e) => setFormData({ ...formData, from_account: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 shadow-inner"
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.account_type} ••••{account.account_number?.slice(-4)} - $
                        {account.balance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {transferType === "internal" && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-900">To Account</label>
                    <select
                      value={formData.to_account}
                      onChange={(e) => setFormData({ ...formData, to_account: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 shadow-inner"
                    >
                      <option value="" className="text-gray-400">Select account</option>
                      {accounts
                        .filter((a) => a.id !== formData.from_account)
                        .map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.account_type} ••••{account.account_number?.slice(-4)}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {transferType === "external" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-900">Account Number</label>
                      <input
                        type="text"
                        value={formData.to_external_account}
                        onChange={(e) =>
                          setFormData({ ...formData, to_external_account: e.target.value })
                        }
                        required
                        placeholder="Enter account number"
                        className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-900">Routing Number</label>
                      <input
                        type="text"
                        value={formData.to_external_routing}
                        onChange={(e) =>
                          setFormData({ ...formData, to_external_routing: e.target.value })
                        }
                        required
                        placeholder="Enter routing number"
                        className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                      />
                    </div>
                  </>
                )}

                {transferType === "p2p" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-900">Email or Phone</label>
                      <input
                        type="text"
                        value={formData.to_email || formData.to_phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.includes("@")) {
                            setFormData({ ...formData, to_email: value, to_phone: "" });
                          } else {
                            setFormData({ ...formData, to_phone: value, to_email: "" });
                          }
                        }}
                        required
                        placeholder="email@example.com or +1234567890"
                        className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-900">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                    />
                  </div>
                  {selectedAccount && (
                    <p className="text-sm text-neutral-600 font-gruppo mt-2">
                      Available: ${selectedAccount.balance.toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-900">Description (Optional)</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What's this for?"
                    className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={formData.recurring}
                    onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                    className="w-5 h-5 bg-dark-900 border-gold-500/20 rounded"
                  />
                  <label htmlFor="recurring" className="text-sm font-medium cursor-pointer text-neutral-900">
                    Make this a recurring transfer
                  </label>
                </div>

                {formData.recurring && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-900">Schedule Date</label>
                    <input
                      type="date"
                      value={formData.schedule_date}
                      onChange={(e) => setFormData({ ...formData, schedule_date: e.target.value })}
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 shadow-inner"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth disabled:opacity-50 shadow-lg shadow-gold-500/20 active:scale-95"
                >
                  {submitting ? "Processing..." : "Complete Transfer"}
                </button>
              </form>
            </div>

            {/* Recent Transfers */}
            <div className="space-y-6">
              <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Transfers</h3>
                <div className="space-y-3">
                  {history.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No transfer history</p>
                  ) : (
                    history.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center">
                            <Send className="text-gold-500" size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{tx.description || "Transfer"}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold">${tx.amount?.toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gold-500/10 to-gold-600/10 border border-gold-500/30 rounded-xl p-6">
                <Calendar className="text-gold-500 mb-3" size={32} />
                <h3 className="font-semibold mb-2">Schedule Transfers</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Set up recurring transfers to automate your savings and bill payments.
                </p>
                <button
                  onClick={() => setFormData({ ...formData, recurring: true })}
                  className="text-sm text-gold-500 hover:text-gold-400 font-semibold"
                >
                  Learn more →
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
