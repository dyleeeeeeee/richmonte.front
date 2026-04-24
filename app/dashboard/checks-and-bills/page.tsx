"use client";

import { useEffect, useState, FormEvent, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { accountAPI, billAPI, Bill, Account } from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";
import { 
  Receipt, Plus, Calendar, Check, Search, Building, 
  CreditCard, X, DollarSign, Zap, TrendingUp, AlertCircle,
  Camera, Package, FileText, Clock, Shield, Upload, ChevronRight,
  ArrowRight, Landmark, Lock
} from "lucide-react";
import { authAPI, checkAPI } from "@/lib/api";

// ══════════════════════════════════════════════════════════════════════════
// Components
// ══════════════════════════════════════════════════════════════════════════

function BentoCard({ 
  children, 
  className = "", 
  onClick, 
  tone = "light",
  padding = "default"
}: { 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void;
  tone?: "light" | "dark";
  padding?: "default" | "tight" | "none";
}) {
  const base = tone === "dark" 
    ? "bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white border-navy-800 shadow-xl shadow-navy-900/10" 
    : "bg-white text-neutral-900 border-light-200/80 shadow-sm";
  
  const pad = padding === "none" ? "" : padding === "tight" ? "p-4" : "p-6";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={`relative border rounded-[24px] overflow-hidden group transition-all duration-300 ${onClick ? "cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-navy-700/30" : ""} ${base} ${pad} ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ title, icon: Icon, action }: { title: string; icon: any; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center shadow-inner">
          <Icon size={20} />
        </div>
        <h2 className="text-xl font-work-sans font-bold tracking-tight text-neutral-900">{title}</h2>
      </div>
      {action}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Page
// ══════════════════════════════════════════════════════════════════════════

export default function ChecksAndBillsPage() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<Bill[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [billStep, setBillStep] = useState<'search' | 'details' | 'confirm'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayee, setSelectedPayee] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Checks state
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedCheckAccount, setSelectedCheckAccount] = useState("");
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  // PIN & Payment State
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinAction, setPinAction] = useState<'pay_bill' | 'deposit_check' | null>(null);
  const [targetBill, setTargetBill] = useState<Bill | null>(null);
  const [pin, setPin] = useState("");
  const [userHasPin, setUserHasPin] = useState<boolean | null>(null);
  const [verifyingPin, setVerifyingPin] = useState(false);
  const [selectedPayAccount, setSelectedPayAccount] = useState("");

  // Bill form data
  const [billForm, setBillForm] = useState({
    payee_name: '',
    account_number: '',
    bill_type: 'utility',
    amount: '',
    due_date: '',
    auto_pay: false,
  });

  const predefinedPayees = [
    { name: 'Con Edison Electric', type: 'utility', logo: '⚡' },
    { name: 'NYC Water & Sewer', type: 'utility', logo: '💧' },
    { name: 'Verizon Fios', type: 'telecom', logo: '📱' },
    { name: 'AT&T Wireless', type: 'telecom', logo: '📞' },
    { name: 'Chase Sapphire Reserve', type: 'credit_card', logo: '💳' },
    { name: 'American Express', type: 'credit_card', logo: '💳' },
    { name: 'State Farm Insurance', type: 'insurance', logo: '🏠' },
    { name: 'Netflix', type: 'entertainment', logo: '🎬' },
    { name: 'Spotify Premium', type: 'entertainment', logo: '🎵' },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [billsRes, accountsRes, userRes] = await Promise.all([
          billAPI.getBills(),
          accountAPI.getAccounts(),
          authAPI.getCurrentUser(),
        ]);
        if (billsRes.data) setBills(billsRes.data);
        if (accountsRes.data) {
          setAccounts(accountsRes.data);
          if (accountsRes.data.length > 0) {
            setSelectedCheckAccount(accountsRes.data[0].id);
            setSelectedPayAccount(accountsRes.data[0].id);
          }
        }
        if (userRes.data) {
          setUserHasPin(!!userRes.data.transaction_pin_hash);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        showNotification("Failed to load payment data", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [showNotification]);

  const filteredPayees = predefinedPayees.filter(payee =>
    payee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePayeeSelect = (payeeName: string) => {
    setSelectedPayee(payeeName);
    setBillForm(prev => ({ ...prev, payee_name: payeeName }));
    setBillStep('details');
  };

  const handleBillSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await billAPI.addBill({
        ...billForm,
        amount: parseFloat(billForm.amount),
      });
      if (response.data) {
        setBills(prev => [...prev, response.data!]);
        showNotification("Bill added successfully!", "success");
        setShowAddBillModal(false);
        setBillStep('search');
      }
    } catch (error) {
      showNotification("Failed to add bill", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageCapture = (side: "front" | "back", file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === "front") setFrontImage(reader.result as string);
      else setBackImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDeposit = async () => {
    if (!frontImage || !backImage || !depositAmount || !selectedCheckAccount) return;
    
    if (userHasPin === false) {
      showNotification("Please set up your transaction PIN in Transfers first", "error");
      return;
    }

    setPinAction('deposit_check');
    setShowPinModal(true);
  };

  const executeDeposit = async () => {
    setVerifyingPin(true);
    try {
      const response = await checkAPI.depositCheck({
        account_id: selectedCheckAccount,
        amount: parseFloat(depositAmount),
        pin: pin,
        check_number: "Mobile-" + Math.floor(Math.random() * 1000000)
      });

      if (response.data) {
        showNotification(`Check deposit of $${depositAmount} submitted successfully!`, "success");
        setFrontImage(null);
        setBackImage(null);
        setDepositAmount("");
        setPin("");
        setShowPinModal(false);
      } else if (response.error) {
        showNotification(response.error, "error");
      }
    } catch (error) {
      showNotification("Failed to process deposit", "error");
    } finally {
      setVerifyingPin(false);
    }
  };

  const handlePayBill = (bill: Bill) => {
    if (userHasPin === false) {
      showNotification("Please set up your transaction PIN in Transfers first", "error");
      return;
    }
    setTargetBill(bill);
    setPinAction('pay_bill');
    setShowPinModal(true);
  };

  const executeBillPayment = async () => {
    if (!targetBill || !selectedPayAccount) return;
    setVerifyingPin(true);
    try {
      const response = await billAPI.payBill(targetBill.id, {
        account_id: selectedPayAccount,
        amount: targetBill.amount,
        pin: pin
      });

      if (response.data) {
        showNotification(`Payment of $${targetBill.amount.toFixed(2)} to ${targetBill.payee_name} completed!`, "success");
        setPin("");
        setShowPinModal(false);
        setTargetBill(null);
      } else if (response.error) {
        showNotification(response.error, "error");
      }
    } catch (error) {
      showNotification("Failed to process payment", "error");
    } finally {
      setVerifyingPin(false);
    }
  };

  const handlePinSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) {
      showNotification("Please enter a 6-digit PIN", "error");
      return;
    }
    if (pinAction === 'pay_bill') executeBillPayment();
    else if (pinAction === 'deposit_check') executeDeposit();
  };

  const totalDue = useMemo(() => bills.reduce((sum, b) => sum + b.amount, 0), [bills]);
  const upcomingCount = useMemo(() => bills.filter(b => new Date(b.due_date) > new Date()).length, [bills]);

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
        <PageTransition>
          <div className="space-y-6">
            {/* Unified Hero Header */}
            <BentoCard tone="dark" padding="none" className="col-span-full shadow-2xl shadow-navy-950/20">
              <div className="relative p-8 sm:p-10 lg:p-14">
                {/* Advanced decorative elements */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[120px] animate-pulse" />
                <div className="pointer-events-none absolute top-1/2 -left-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />
                <div className="pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-navy-400/10 blur-[120px]" />
                
                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
                  <div className="max-w-2xl">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 mb-6"
                    >
                      <span className="h-px w-8 bg-navy-300/50" />
                      <p className="text-[11px] font-work-sans font-bold tracking-[0.25em] uppercase text-navy-200/60">
                        Financial Command Center
                      </p>
                    </motion.div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-work-sans font-bold tracking-tight leading-[1.05]">
                      Payments & Checks, <br/>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-navy-200 via-sky-200 to-navy-100">unified and precise.</span>
                    </h1>
                    <p className="mt-8 text-base sm:text-lg text-navy-100/60 font-gruppo max-w-xl leading-relaxed">
                      Experience the next evolution of personal finance. Handle recurring obligations and high-value check services from a single, high-fidelity command surface. 
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-5 shrink-0">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 min-w-[240px] shadow-inner"
                    >
                      <p className="text-[10px] font-work-sans font-bold tracking-[0.16em] uppercase text-navy-200/50 mb-3">Total bill debt</p>
                      <p className="text-4xl font-work-sans font-bold tabular-nums">${totalDue.toFixed(2)}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-navy-300/80 font-gruppo">
                        <div className="w-5 h-5 rounded-full bg-navy-700/50 flex items-center justify-center">
                          <Calendar size={12} />
                        </div>
                        <span>{upcomingCount} upcoming bills</span>
                      </div>
                    </motion.div>
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => setShowAddBillModal(true)}
                        className="w-full py-4 px-6 bg-white text-navy-900 rounded-[20px] font-work-sans font-bold text-sm hover:bg-navy-50 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 group"
                      >
                        <div className="w-6 h-6 rounded-lg bg-navy-900 text-white flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                          <Plus size={16} />
                        </div>
                        Add New Payee
                      </button>
                      <button 
                        className="w-full py-4 px-6 bg-navy-700/50 backdrop-blur-md text-white border border-white/10 rounded-[20px] font-work-sans font-bold text-sm hover:bg-navy-600/50 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                      >
                        <TrendingUp size={16} className="text-sky-300" />
                        View Analytics
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-auto">
              
              {/* Bills Hub - Asymmetric large module */}
              <BentoCard className="lg:col-span-8 lg:row-span-2 bg-gradient-to-br from-white to-light-50/50">
                <SectionHeader 
                  title="Bill Management" 
                  icon={Receipt} 
                  action={
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-light-100 rounded-xl transition-colors text-neutral-400"><Search size={20}/></button>
                      <button onClick={() => setShowAddBillModal(true)} className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center shadow-lg hover:bg-black transition-all active:scale-95">
                        <Plus size={20} />
                      </button>
                    </div>
                  }
                />
                
                {bills.length === 0 ? (
                  <div className="py-24 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-8">
                      <div className="absolute inset-0 bg-navy-100 rounded-3xl rotate-6 animate-pulse" />
                      <div className="absolute inset-0 bg-navy-50 rounded-3xl -rotate-3 transition-transform group-hover:rotate-0" />
                      <div className="relative h-full w-full flex items-center justify-center text-navy-300">
                        <Landmark size={36} />
                      </div>
                    </div>
                    <h3 className="text-lg font-work-sans font-bold text-neutral-900 mb-2">Pristine Ledger</h3>
                    <p className="text-neutral-500 font-gruppo max-w-xs mx-auto">No bills currently detected. Add your first payee to begin tracking.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-5">
                    {bills.map((bill, idx) => (
                      <motion.div 
                        key={bill.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group p-6 rounded-[28px] bg-white border border-light-200/80 hover:border-navy-700/30 hover:shadow-xl hover:shadow-navy-900/5 transition-all duration-500"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-light-50 border border-light-200 flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:scale-110 duration-500">
                              {bill.bill_type === 'utility' ? '⚡' : bill.bill_type === 'telecom' ? '📱' : bill.bill_type === 'credit_card' ? '💳' : '📄'}
                            </div>
                            <div>
                              <h3 className="font-work-sans font-bold text-neutral-900 leading-none">{bill.payee_name}</h3>
                              <p className="text-[9px] text-neutral-400 uppercase tracking-[0.15em] font-bold mt-2">{bill.bill_type}</p>
                            </div>
                          </div>
                          {bill.auto_pay && (
                            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold border border-emerald-100/50 uppercase tracking-widest">Active Auto</div>
                          )}
                        </div>
                        <div className="mb-6">
                          <p className="text-3xl font-work-sans font-bold text-neutral-900 tracking-tight tabular-nums">${bill.amount.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-light-100">
                          <span className="flex items-center gap-2 text-xs text-neutral-400 font-gruppo font-medium">
                            <Calendar size={14} className="text-neutral-300" /> 
                            Due {new Date(bill.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          <button 
                            onClick={() => handlePayBill(bill)}
                            className="h-9 px-4 bg-navy-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all active:scale-95"
                          >
                            Settle
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </BentoCard>

              {/* Mobile Deposit - Futuristic Glass Card */}
              <BentoCard className="lg:col-span-4 lg:row-span-2 overflow-hidden border-navy-100/50 bg-gradient-to-b from-white to-sky-50/20">
                <div className="relative">
                  <SectionHeader title="Mobile Deposit" icon={Camera} />
                  <p className="text-sm text-neutral-500 font-gruppo mb-8 leading-relaxed">
                    High-fidelity capture system. Snap both sides for immediate processing.
                  </p>
                  
                  <div className="space-y-5">
                    {/* Front Side */}
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => frontInputRef.current?.click()}
                      className={`relative aspect-[1.586/1] rounded-[24px] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden group/cap ${frontImage ? "border-emerald-500 bg-emerald-50/20 shadow-lg shadow-emerald-500/10" : "border-navy-100 bg-light-50/50 hover:bg-white hover:border-navy-300"}`}
                    >
                      {frontImage ? (
                        <Image src={frontImage} alt="Front" fill className="object-cover transition-transform duration-700 group-hover/cap:scale-105" />
                      ) : (
                        <>
                          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-navy-700 shadow-md group-hover/cap:bg-navy-700 group-hover/cap:text-white transition-colors duration-300"><Upload size={22} /></div>
                          <div className="text-center">
                            <span className="block text-xs font-work-sans font-bold text-navy-900">Front Surface</span>
                            <span className="text-[10px] text-neutral-400 font-gruppo">Clear and well-lit</span>
                          </div>
                        </>
                      )}
                      <input ref={frontInputRef} type="file" className="hidden" onChange={e => e.target.files?.[0] && handleImageCapture("front", e.target.files[0])} />
                    </motion.div>

                    {/* Back Side */}
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => backInputRef.current?.click()}
                      className={`relative aspect-[1.586/1] rounded-[24px] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden group/cap ${backImage ? "border-emerald-500 bg-emerald-50/20 shadow-lg shadow-emerald-500/10" : "border-navy-100 bg-light-50/50 hover:bg-white hover:border-navy-300"}`}
                    >
                      {backImage ? (
                        <Image src={backImage} alt="Back" fill className="object-cover transition-transform duration-700 group-hover/cap:scale-105" />
                      ) : (
                        <>
                          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-navy-700 shadow-md group-hover/cap:bg-navy-700 group-hover/cap:text-white transition-colors duration-300"><Upload size={22} /></div>
                          <div className="text-center">
                            <span className="block text-xs font-work-sans font-bold text-navy-900">Endorsement Side</span>
                            <span className="text-[10px] text-neutral-400 font-gruppo">Ensure signature is visible</span>
                          </div>
                        </>
                      )}
                      <input ref={backInputRef} type="file" className="hidden" onChange={e => e.target.files?.[0] && handleImageCapture("back", e.target.files[0])} />
                    </motion.div>

                    <div className="pt-4">
                      <div className="relative mb-3 group">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 ml-1">Destination Account</label>
                        <select 
                          value={selectedCheckAccount}
                          onChange={e => setSelectedCheckAccount(e.target.value)}
                          className="w-full px-4 py-4 bg-light-50 border border-light-200 rounded-2xl focus:outline-none focus:border-navy-700 font-work-sans font-bold text-sm text-neutral-900"
                        >
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                              {acc.account_type} ••••{acc.account_number?.slice(-4)} (${acc.balance.toLocaleString()})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="relative mb-5 group">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 ml-1">Deposit Amount</label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-navy-700/5 rounded-2xl transition-all group-focus-within:bg-navy-700/10" />
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-900/40 font-bold text-lg">$</span>
                          <input 
                            type="number" 
                            placeholder="0.00" 
                            value={depositAmount}
                            onChange={e => setDepositAmount(e.target.value)}
                            className="relative w-full pl-10 pr-5 py-5 bg-transparent rounded-2xl focus:outline-none font-work-sans font-bold text-xl text-neutral-900 placeholder:text-neutral-300"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={handleDeposit}
                        disabled={!frontImage || !backImage || !depositAmount}
                        className="w-full py-5 bg-gradient-to-r from-navy-900 to-black text-white rounded-2xl font-work-sans font-bold text-base hover:shadow-xl hover:shadow-navy-900/20 transition-all disabled:opacity-30 flex items-center justify-center gap-3 active:scale-[0.98]"
                      >
                        Execute Deposit <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </BentoCard>

              {/* Order Checks Module */}
              <BentoCard className="lg:col-span-4 p-0 overflow-hidden flex flex-col">
                <div className="p-6">
                  <SectionHeader title="Checkbooks" icon={Package} />
                  <p className="text-sm text-neutral-500 font-gruppo mb-4">Need physical checks? Order a new book with premium Swiss designs.</p>
                  <div className="flex -space-x-3 mb-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-xl border-2 border-white bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center text-white text-[10px] font-bold shadow-lg">IVB</div>
                    ))}
                  </div>
                </div>
                <button className="mt-auto w-full py-4 bg-light-50 hover:bg-light-100 text-navy-900 font-work-sans font-bold text-sm transition-colors flex items-center justify-center gap-2 border-t border-light-200">
                  Order Checkbook <ChevronRight size={16} />
                </button>
              </BentoCard>

              {/* History Module */}
              <BentoCard className="lg:col-span-8 flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={16} className="text-neutral-400" />
                    <span className="text-xs font-work-sans font-bold uppercase tracking-widest text-neutral-400">Payment Activity</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { type: 'Bill', name: 'Verizon Fios', amount: -124.50, date: 'Yesterday', status: 'Completed' },
                      { type: 'Check', name: 'Mobile Deposit', amount: 2500.00, date: 'Oct 12', status: 'Pending' },
                      { type: 'Bill', name: 'Netflix', amount: -15.99, date: 'Oct 10', status: 'Completed' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-light-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${item.amount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                            {item.type === 'Bill' ? <Receipt size={14} /> : <Camera size={14} />}
                          </div>
                          <div>
                            <p className="text-sm font-work-sans font-bold text-neutral-900">{item.name}</p>
                            <p className="text-[10px] text-neutral-400 font-gruppo">{item.date} • {item.status}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-work-sans font-bold ${item.amount > 0 ? "text-emerald-600" : "text-neutral-900"}`}>
                          {item.amount > 0 ? "+" : ""}{item.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:w-48 bg-navy-50 rounded-2xl p-5 flex flex-col justify-between border border-navy-100/50">
                  <p className="text-xs text-navy-800/60 font-gruppo leading-tight">Your payments are protected by 256-bit encryption and Swiss fraud detection.</p>
                  <div className="mt-4 flex items-center gap-2 text-navy-700">
                    <Shield size={20} />
                    <span className="text-[10px] font-work-sans font-bold uppercase tracking-widest">Secure View</span>
                  </div>
                </div>
              </BentoCard>

            </div>
          </div>
        </PageTransition>

        {/* Add Bill Modal - Keeping existing logic but styling it premium */}
        <AnimatePresence>
          {showAddBillModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-light-200"
              >
                <div className="p-8 border-b border-light-100 flex items-center justify-between">
                  <h2 className="text-2xl font-work-sans font-bold text-neutral-900">Configure Payment</h2>
                  <button onClick={() => setShowAddBillModal(false)} className="p-2 hover:bg-light-100 rounded-full transition-colors"><X size={24} /></button>
                </div>
                
                <div className="p-8">
                  {billStep === 'search' ? (
                    <div className="space-y-6">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                        <input 
                          type="text" 
                          placeholder="Search payees..." 
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-light-50 border border-light-200 rounded-2xl focus:outline-none focus:border-navy-700 font-work-sans"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredPayees.map(p => (
                          <button key={p.name} onClick={() => handlePayeeSelect(p.name)} className="flex items-center gap-3 p-4 rounded-2xl border border-light-200 hover:border-navy-700 hover:bg-navy-50/30 transition-all text-left">
                            <span className="text-2xl">{p.logo}</span>
                            <span className="font-work-sans font-bold text-sm">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleBillSubmit} className="space-y-4">
                       <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Payee Name</label>
                        <input 
                          type="text" value={billForm.payee_name} readOnly 
                          className="w-full px-4 py-3 bg-light-50 border border-light-200 rounded-xl font-work-sans font-bold text-neutral-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Amount</label>
                          <input 
                            type="number" step="0.01" required
                            value={billForm.amount}
                            onChange={e => setBillForm({...billForm, amount: e.target.value})}
                            className="w-full px-4 py-3 bg-light-50 border border-light-200 rounded-xl font-work-sans font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Due Date</label>
                          <input 
                            type="date" required
                            value={billForm.due_date}
                            onChange={e => setBillForm({...billForm, due_date: e.target.value})}
                            className="w-full px-4 py-3 bg-light-50 border border-light-200 rounded-xl font-work-sans font-bold"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit" disabled={saving}
                        className="w-full py-4 bg-navy-900 text-white rounded-2xl font-work-sans font-bold hover:bg-black transition-all disabled:opacity-50 mt-4"
                      >
                        {saving ? "Processing..." : "Add Bill Payee"}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PIN Verification Modal */}
        <AnimatePresence>
          {showPinModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-light-200"
              >
                <div className="p-8 border-b border-light-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy-900 text-white rounded-xl flex items-center justify-center">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-work-sans font-bold text-neutral-900">Authorize Action</h2>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">Secure Transaction</p>
                    </div>
                  </div>
                  <button onClick={() => setShowPinModal(false)} className="p-2 hover:bg-light-100 rounded-full transition-colors"><X size={20} /></button>
                </div>
                
                <form onSubmit={handlePinSubmit} className="p-8 space-y-6">
                  {pinAction === 'pay_bill' && targetBill && (
                    <div className="p-4 bg-light-50 rounded-2xl border border-light-100">
                      <p className="text-xs text-neutral-500 font-gruppo mb-1">Paying {targetBill.payee_name}</p>
                      <p className="text-lg font-work-sans font-bold text-navy-900">${targetBill.amount.toFixed(2)}</p>
                      
                      <div className="mt-4">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">From Account</label>
                        <select 
                          value={selectedPayAccount}
                          onChange={e => setSelectedPayAccount(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-light-200 rounded-xl text-xs font-bold"
                        >
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                              {acc.account_type} ••••{acc.account_number?.slice(-4)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Enter 6-Digit PIN</label>
                    <input 
                      type="password" 
                      maxLength={6}
                      autoFocus
                      value={pin}
                      onChange={e => setPin(e.target.value)}
                      placeholder="••••••"
                      className="w-full p-4 bg-light-50 border border-light-200 rounded-2xl focus:outline-none focus:border-navy-700 font-mono text-center text-2xl tracking-[0.5em] text-navy-900 placeholder:text-neutral-200"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={verifyingPin || pin.length !== 6}
                    className="w-full py-4 bg-navy-900 text-white rounded-2xl font-work-sans font-bold hover:bg-black transition-all disabled:opacity-30 active:scale-[0.98]"
                  >
                    {verifyingPin ? "Verifying..." : "Confirm Transaction"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
