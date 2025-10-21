"use client";

import { useEffect, useState, FormEvent } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { accountAPI, billAPI, Bill, Account } from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";
import { Receipt, Plus, Calendar, Check, Search, Building, CreditCard, X, DollarSign } from "lucide-react";

export default function BillsPage() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<Bill[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [billStep, setBillStep] = useState<'search' | 'details' | 'confirm'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayee, setSelectedPayee] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Bill form data
  const [billForm, setBillForm] = useState({
    payee_name: '',
    account_number: '',
    bill_type: 'utility',
    amount: '',
    due_date: '',
    auto_pay: false,
  });

  // Predefined payees (like Chase's database)
  const predefinedPayees = [
    { name: 'Con Edison Electric', type: 'utility', logo: '⚡' },
    { name: 'NYC Water & Sewer', type: 'utility', logo: '💧' },
    { name: 'Verizon Fios', type: 'telecom', logo: '📱' },
    { name: 'AT&T Wireless', type: 'telecom', logo: '📞' },
    { name: 'Chase Sapphire Reserve', type: 'credit_card', logo: '💳' },
    { name: 'American Express', type: 'credit_card', logo: '💳' },
    { name: 'State Farm Insurance', type: 'insurance', logo: '🏠' },
    { name: 'Progressive Insurance', type: 'insurance', logo: '🚗' },
    { name: 'Netflix', type: 'entertainment', logo: '🎬' },
    { name: 'Spotify Premium', type: 'entertainment', logo: '🎵' },
    { name: 'Amazon Prime', type: 'shopping', logo: '📦' },
    { name: 'Apple Music', type: 'entertainment', logo: '🎵' },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [billsRes, accountsRes] = await Promise.all([
          billAPI.getBills(),
          accountAPI.getAccounts(),
        ]);

        if (billsRes.data) setBills(billsRes.data);
        if (accountsRes.data) setAccounts(accountsRes.data);
      } catch (error) {
        console.error("Failed to load data:", error);
        showNotification("Failed to load bill data", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [showNotification]);

  // Filter payees based on search
  const filteredPayees = predefinedPayees.filter(payee =>
    payee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePayeeSelect = (payeeName: string) => {
    setSelectedPayee(payeeName);
    setBillForm(prev => ({ ...prev, payee_name: payeeName }));
    setBillStep('details');
  };

  const handleCustomPayee = () => {
    setSelectedPayee('custom');
    setBillForm(prev => ({ ...prev, payee_name: '' }));
    setBillStep('details');
  };

  const handleBillSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!billForm.payee_name || !billForm.amount || !billForm.due_date) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    setSaving(true);
    try {
      const response = await billAPI.addBill({
        payee_name: billForm.payee_name,
        account_number: billForm.account_number,
        bill_type: billForm.bill_type,
        amount: parseFloat(billForm.amount),
        due_date: billForm.due_date,
        auto_pay: billForm.auto_pay,
      });

      if (response.data) {
        setBills(prev => [...prev, response.data!]);
        showNotification("Bill added successfully!", "success");
        handleCloseModal();
      }
    } catch (error) {
      showNotification("Failed to add bill. Please try again.", "error");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddBillModal(false);
    setBillStep('search');
    setSearchQuery('');
    setSelectedPayee(null);
    setBillForm({
      payee_name: '',
      account_number: '',
      bill_type: 'utility',
      amount: '',
      due_date: '',
      auto_pay: false,
    });
  };

  const getBillTypeIcon = (type: string) => {
    switch (type) {
      case 'utility': return '⚡';
      case 'telecom': return '📱';
      case 'credit_card': return '💳';
      case 'insurance': return '🏠';
      case 'entertainment': return '🎬';
      case 'shopping': return '🛍️';
      default: return '📄';
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-1 sm:mb-2 text-white">Bill Pay</h1>
              <p className="text-sm sm:text-base text-gray-400">Manage and pay your bills</p>
            </div>
            <button
              onClick={() => setShowAddBillModal(true)}
              className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth flex-shrink-0 text-sm sm:text-base active:scale-95 shadow-lg shadow-gold-500/20 hover-glow"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Add Bill</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bills.map((bill) => (
              <div key={bill.id} className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">{bill.payee_name}</h3>
                <p className="text-2xl font-bold mb-4 text-white">${bill.amount}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
                  <Calendar size={16} />
                  <span>Due: {new Date(bill.due_date).toLocaleDateString()}</span>
                </div>
                <button className="w-full px-4 py-2 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400">
                  Pay Now
                </button>
                <p className="text-xs text-center text-gray-400 mt-2">
                  {bill.auto_pay ? "Auto-pay enabled" : "Manual payment"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Bill Modal - Chase-like Flow */}
        {showAddBillModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl glass-gold border border-gold-500/30 rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gold-500/20">
                <h2 className="text-2xl font-work-sans font-bold text-neutral-900">
                  {billStep === 'search' && 'Add a Bill'}
                  {billStep === 'details' && 'Bill Details'}
                  {billStep === 'confirm' && 'Confirm Bill'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-neutral-600" />
                </button>
              </div>

              {/* Step Indicator */}
              <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 ${billStep === 'search' ? 'text-gold-600' : billStep === 'details' || billStep === 'confirm' ? 'text-green-600' : 'text-neutral-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${billStep === 'search' ? 'bg-gold-600 text-white' : billStep === 'details' || billStep === 'confirm' ? 'bg-green-600 text-white' : 'bg-neutral-300 text-neutral-600'}`}>
                      1
                    </div>
                    <span className="font-medium">Find Payee</span>
                  </div>
                  <div className={`flex-1 h-px ${billStep === 'details' || billStep === 'confirm' ? 'bg-green-600' : 'bg-neutral-300'}`} />
                  <div className={`flex items-center space-x-2 ${billStep === 'details' ? 'text-gold-600' : billStep === 'confirm' ? 'text-green-600' : 'text-neutral-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${billStep === 'details' ? 'bg-gold-600 text-white' : billStep === 'confirm' ? 'bg-green-600 text-white' : 'bg-neutral-300 text-neutral-600'}`}>
                      2
                    </div>
                    <span className="font-medium">Add Details</span>
                  </div>
                  <div className={`flex-1 h-px ${billStep === 'confirm' ? 'bg-green-600' : 'bg-neutral-300'}`} />
                  <div className={`flex items-center space-x-2 ${billStep === 'confirm' ? 'text-gold-600' : 'text-neutral-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${billStep === 'confirm' ? 'bg-gold-600 text-white' : 'bg-neutral-300 text-neutral-600'}`}>
                      3
                    </div>
                    <span className="font-medium">Confirm</span>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {billStep === 'search' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-neutral-900">Search for a Payee</h3>
                      <p className="text-neutral-600 mb-4">Find your biller from our database or add a custom payee</p>

                      {/* Search Input */}
                      <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                        <input
                          type="text"
                          placeholder="Search payees (e.g., Con Edison, Netflix, Verizon)..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                        />
                      </div>

                      {/* Payee Results */}
                      <div className="space-y-3 mb-6">
                        {filteredPayees.length > 0 ? (
                          filteredPayees.map((payee) => (
                            <button
                              key={payee.name}
                              onClick={() => handlePayeeSelect(payee.name)}
                              className="w-full flex items-center space-x-4 p-4 glass hover:glass-gold rounded-lg transition-all text-left group"
                            >
                              <div className="text-2xl">{payee.logo}</div>
                              <div className="flex-1">
                                <div className="font-medium text-neutral-900 group-hover:text-gold-700">{payee.name}</div>
                                <div className="text-sm text-neutral-600 capitalize">{payee.type.replace('_', ' ')}</div>
                              </div>
                              <div className="text-gold-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-sm font-medium">Add</span>
                              </div>
                            </button>
                          ))
                        ) : searchQuery ? (
                          <div className="text-center py-8">
                            <Building className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                            <p className="text-neutral-600 mb-4">No payees found matching &quot;{searchQuery}&quot;</p>
                            <button
                              onClick={handleCustomPayee}
                              className="px-6 py-2 bg-gold-600 text-white rounded-lg font-medium hover:bg-gold-500 transition-colors"
                            >
                              Add Custom Payee
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Search className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                            <p className="text-neutral-600 mb-4">Start typing to search for payees</p>
                          </div>
                        )}
                      </div>

                      {/* Add Custom Payee Button */}
                      <div className="text-center">
                        <button
                          onClick={handleCustomPayee}
                          className="px-6 py-2 border border-gold-600 text-gold-600 rounded-lg font-medium hover:bg-gold-50 transition-colors"
                        >
                          <Plus size={16} className="inline mr-2" />
                          Add Custom Payee
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {billStep === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-neutral-900">Bill Details</h3>
                      <p className="text-neutral-600 mb-6">Enter the details for your {selectedPayee === 'custom' ? 'custom' : selectedPayee} bill</p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); setBillStep('confirm'); }} className="space-y-6">
                      {selectedPayee === 'custom' && (
                        <div>
                          <label className="block text-sm font-medium mb-2 text-neutral-900">Payee Name</label>
                          <input
                            type="text"
                            value={billForm.payee_name}
                            onChange={(e) => setBillForm({ ...billForm, payee_name: e.target.value })}
                            placeholder="Enter payee name"
                            className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                            required
                          />
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-neutral-900">Bill Type</label>
                          <select
                            value={billForm.bill_type}
                            onChange={(e) => setBillForm({ ...billForm, bill_type: e.target.value })}
                            className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 shadow-inner"
                          >
                            <option value="utility">Utility</option>
                            <option value="telecom">Telecom</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="insurance">Insurance</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="shopping">Shopping</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-neutral-900">Amount</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                            <input
                              type="number"
                              value={billForm.amount}
                              onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              className="w-full pl-10 pr-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-neutral-900">Due Date</label>
                          <input
                            type="date"
                            value={billForm.due_date}
                            onChange={(e) => setBillForm({ ...billForm, due_date: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 shadow-inner"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-neutral-900">Account Number (Optional)</label>
                          <input
                            type="text"
                            value={billForm.account_number}
                            onChange={(e) => setBillForm({ ...billForm, account_number: e.target.value })}
                            placeholder="Account or reference number"
                            className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="auto_pay"
                          checked={billForm.auto_pay}
                          onChange={(e) => setBillForm({ ...billForm, auto_pay: e.target.checked })}
                          className="w-4 h-4 text-gold-600 bg-gray-100 border-gray-300 rounded focus:ring-gold-500"
                        />
                        <label htmlFor="auto_pay" className="text-sm text-neutral-900">
                          <span className="font-medium">Enable Auto Pay</span>
                          <span className="text-neutral-600 block">Automatically pay this bill when due</span>
                        </label>
                      </div>

                      <div className="flex space-x-4 pt-6">
                        <button
                          type="button"
                          onClick={() => setBillStep('search')}
                          className="flex-1 px-6 py-3 glass text-neutral-700 rounded-lg font-work-sans font-semibold hover:glass-gold transition-smooth"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth"
                        >
                          Continue
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {billStep === 'confirm' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-neutral-900">Confirm Bill Details</h3>
                      <p className="text-neutral-600 mb-6">Please review the information below before adding this bill</p>
                    </div>

                    {/* Confirmation Summary */}
                    <div className="glass rounded-xl p-6 space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <span className="text-sm text-neutral-600">Payee</span>
                          <p className="font-medium text-neutral-900">{billForm.payee_name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-neutral-600">Bill Type</span>
                          <p className="font-medium text-neutral-900 capitalize">{billForm.bill_type.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-sm text-neutral-600">Amount</span>
                          <p className="font-medium text-neutral-900">${parseFloat(billForm.amount).toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-neutral-600">Due Date</span>
                          <p className="font-medium text-neutral-900">{new Date(billForm.due_date).toLocaleDateString()}</p>
                        </div>
                        {billForm.account_number && (
                          <div className="md:col-span-2">
                            <span className="text-sm text-neutral-600">Account Number</span>
                            <p className="font-medium text-neutral-900">{billForm.account_number}</p>
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <span className="text-sm text-neutral-600">Auto Pay</span>
                          <p className="font-medium text-neutral-900">{billForm.auto_pay ? 'Enabled' : 'Disabled'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setBillStep('details')}
                        className="flex-1 px-6 py-3 glass text-neutral-700 rounded-lg font-work-sans font-semibold hover:glass-gold transition-smooth"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleBillSubmit}
                        disabled={saving}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth disabled:opacity-50"
                      >
                        {saving ? "Adding Bill..." : "Add Bill"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
