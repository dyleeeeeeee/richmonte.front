"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import CreditCard from "@/components/CreditCard";
import { cardAPI, Card } from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CreditCard as CreditCardIcon, Lock, Unlock, AlertCircle, 
  Plus, Sparkles, Shield, MessageSquare, ChevronRight, 
  Eye, EyeOff, Zap, Globe, Plane, Coffee, ShoppingBag,
  TrendingUp, Activity, Smartphone, Info, X, Landmark
} from "lucide-react";

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

export default function CardsPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    issue_type: 'lost' as 'lost' | 'stolen' | 'damaged' | 'other',
    description: '',
  });

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const response = await cardAPI.getCards();
      if (response.data) {
        setCards(response.data);
      }
    } catch (error) {
      console.error("Failed to load cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeCard = cards[activeCardIndex];

  const toggleLock = async () => {
    if (!activeCard) return;
    const newStatus = activeCard.status === "active" ? "locked" : "active";
    try {
      const response = await cardAPI.lockCard(activeCard.id, newStatus === "locked");
      if (response.data) {
        setCards(cards.map((c, i) => i === activeCardIndex ? { ...c, status: newStatus } : c));
        showNotification(`Card ${newStatus === "locked" ? "locked" : "unlocked"} successfully`, "success");
      }
    } catch (error) {
      showNotification("Failed to update status", "error");
    }
  };

  const reportIssue = async () => {
    if (!activeCard) return;
    try {
      const response = await cardAPI.reportCardIssue(activeCard.id, reportForm);
      if (response.data) {
        setCards(cards.map((c, i) => i === activeCardIndex ? { ...c, status: "reported" } : c));
        showNotification("Issue reported. Card suspended.", "success");
        setShowReportModal(false);
      }
    } catch (error) {
      showNotification("Failed to report issue", "error");
    }
  };

  const totalSpendPower = useMemo(() => 
    cards.reduce((sum, card) => sum + (card.credit_limit || card.balance || 0), 0), 
  [cards]);

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
                <div className="pointer-events-none absolute -top-24 -right-24 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[120px] animate-pulse" />
                <div className="pointer-events-none absolute top-1/2 -left-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />
                
                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
                  <div className="max-w-2xl">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 mb-6"
                    >
                      <span className="h-px w-8 bg-navy-300/50" />
                      <p className="text-[11px] font-work-sans font-bold tracking-[0.25em] uppercase text-navy-200/60">
                        Card Control Suite
                      </p>
                    </motion.div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-work-sans font-bold tracking-tight leading-[1.05]">
                      Managed like a <br/>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-navy-200 via-sky-200 to-navy-100">private access deck.</span>
                    </h1>
                    <p className="mt-8 text-base sm:text-lg text-navy-100/60 font-gruppo max-w-xl leading-relaxed">
                      Control your spending lanes, lock your assets, and reveal credentials on demand from a modular, security-first command surface.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-5 shrink-0">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 min-w-[240px] shadow-inner"
                    >
                      <p className="text-[10px] font-work-sans font-bold tracking-[0.16em] uppercase text-navy-200/50 mb-3">Aggregated Limit</p>
                      <p className="text-4xl font-work-sans font-bold tabular-nums">${totalSpendPower.toLocaleString()}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-navy-300/80 font-gruppo">
                        <div className="w-5 h-5 rounded-full bg-navy-700/50 flex items-center justify-center">
                          <Activity size={12} />
                        </div>
                        <span>Across {cards.length} active lanes</span>
                      </div>
                    </motion.div>
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => router.push("/dashboard/cards/apply")}
                        className="w-full py-4 px-6 bg-white text-navy-900 rounded-[20px] font-work-sans font-bold text-sm hover:bg-navy-50 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 group"
                      >
                        <div className="w-6 h-6 rounded-lg bg-navy-900 text-white flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                          <Plus size={16} />
                        </div>
                        Request New Card
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </BentoCard>

            {cards.length === 0 ? (
               <BentoCard className="p-20 text-center">
                <div className="relative w-20 h-20 mx-auto mb-8">
                  <div className="absolute inset-0 bg-navy-100 rounded-3xl rotate-6 animate-pulse" />
                  <div className="absolute inset-0 bg-navy-50 rounded-3xl -rotate-3 transition-transform group-hover:rotate-0" />
                  <div className="relative h-full w-full flex items-center justify-center text-navy-300">
                    <CreditCardIcon size={36} />
                  </div>
                </div>
                <h3 className="text-xl font-work-sans font-bold text-neutral-900 mb-2">Vault is Empty</h3>
                <p className="text-neutral-500 font-gruppo max-w-xs mx-auto mb-8">Apply for your first InvBank card to unlock digital provisioning and instant spending.</p>
                <button 
                  onClick={() => router.push("/dashboard/cards/apply")}
                  className="px-8 py-4 bg-navy-900 text-white rounded-2xl font-work-sans font-bold text-sm hover:bg-black transition-all active:scale-95"
                >
                  Apply Now
                </button>
              </BentoCard>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-auto">
                
                {/* Card Spotlight - 3D Tilt Effect Simulation */}
                <BentoCard className="lg:col-span-7 xl:col-span-8 p-8 flex flex-col xl:flex-row items-center gap-10">
                  <div className="w-full max-w-[400px] shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.02, rotateY: 5, rotateX: -5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <CreditCard
                        cardNumber={activeCard.card_number}
                        holder={user?.full_name || "Cardholder"}
                        expiryDate={activeCard.expiry_date}
                        cvv={activeCard.cvv}
                        tier={activeCard.card_type}
                        brand={activeCard.card_brand}
                        balance={activeCard.balance}
                        creditLimit={activeCard.credit_limit}
                        status={activeCard.status}
                      />
                    </motion.div>
                  </div>

                  <div className="flex-1 w-full space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="px-3 py-1 bg-navy-50 text-navy-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-navy-100">
                          {activeCard.card_type} Elite
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          activeCard.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {activeCard.status}
                        </div>
                      </div>
                      <h2 className="text-3xl font-work-sans font-bold text-neutral-900">Digital Asset Lane</h2>
                      <p className="text-neutral-500 font-gruppo mt-2">Provisioned via {activeCard.card_brand} Rails</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-light-50 rounded-2xl border border-light-100 shadow-inner">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Available</p>
                        <p className="text-2xl font-work-sans font-bold text-neutral-900 tabular-nums">${(activeCard.balance || 0).toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-light-50 rounded-2xl border border-light-100 shadow-inner">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Limit</p>
                        <p className="text-2xl font-work-sans font-bold text-neutral-900 tabular-nums">${(activeCard.credit_limit || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={toggleLock}
                        className="flex-1 min-w-[140px] py-4 bg-navy-900 text-white rounded-xl font-work-sans font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2"
                      >
                        {activeCard.status === 'locked' ? <Unlock size={18}/> : <Lock size={18}/>}
                        {activeCard.status === 'locked' ? 'Unfreeze' : 'Secure Vault'}
                      </button>
                      <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="px-6 py-4 bg-light-50 text-navy-900 border border-light-200 rounded-xl font-work-sans font-bold text-sm hover:bg-white hover:shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        {showDetails ? <EyeOff size={18}/> : <Eye size={18}/>}
                        Details
                      </button>
                      <button 
                         onClick={() => setShowReportModal(true)}
                         className="p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                      >
                        <AlertCircle size={20} />
                      </button>
                    </div>
                  </div>
                </BentoCard>

                {/* Security Status - Glass Card */}
                <BentoCard className="lg:col-span-5 xl:col-span-4 bg-gradient-to-b from-white to-navy-50/30">
                  <SectionHeader title="Security Deck" icon={Shield} />
                  <p className="text-sm text-neutral-500 font-gruppo mb-6">Real-time isolation controls for your digital lane.</p>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'online', label: 'Online Transactions', icon: Globe },
                      { id: 'contactless', label: 'Contactless Pay', icon: Zap },
                      { id: 'atm', label: 'ATM Withdrawals', icon: Landmark },
                      { id: 'international', label: 'International Use', icon: Plane },
                    ].map((item) => {
                      const settings = (activeCard as any).security_settings || {
                        online: true,
                        contactless: true,
                        atm: true,
                        international: false
                      };
                      const isActive = settings[item.id] ?? false;

                      return (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-light-100 rounded-2xl group hover:shadow-md transition-all">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-navy-50 text-navy-700' : 'bg-light-50 text-neutral-400'}`}>
                              <item.icon size={16} />
                            </div>
                            <span className="text-sm font-work-sans font-bold text-neutral-900">{item.label}</span>
                          </div>
                          <div 
                            onClick={async () => {
                              const newSettings = { ...settings, [item.id]: !isActive };
                              try {
                                const response = await cardAPI.updateCardSettings(activeCard.id, newSettings);
                                if (response.data) {
                                  setCards(cards.map((c, i) => i === activeCardIndex ? { ...c, security_settings: newSettings } : c));
                                  showNotification(`${item.label} ${!isActive ? 'enabled' : 'disabled'}`, "success");
                                }
                              } catch (err) {
                                showNotification("Failed to update security settings", "error");
                              }
                            }}
                            className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${isActive ? 'bg-navy-900' : 'bg-light-200'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isActive ? 'left-5' : 'left-1'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </BentoCard>

                {/* Benefits Carousel - Bento Style */}
                <BentoCard className="lg:col-span-4 p-0 overflow-hidden flex flex-col">
                  <div className="p-8">
                    <SectionHeader title="Active Perks" icon={Sparkles} />
                    <div className="space-y-6 mt-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                          <Plane size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-work-sans font-bold text-neutral-900">Lounge Access</p>
                          <p className="text-[10px] text-neutral-400 font-gruppo uppercase tracking-widest">Global Priority Pass</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                          <Coffee size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-work-sans font-bold text-neutral-900">Dining Multiplier</p>
                          <p className="text-[10px] text-neutral-400 font-gruppo uppercase tracking-widest">3X Points on Gastronomy</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="mt-auto w-full py-5 bg-navy-900 text-white font-work-sans font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                    Explore All Benefits <ChevronRight size={16} />
                  </button>
                </BentoCard>

                {/* Spending Velocity - Innovative Chart Simulation */}
                <BentoCard className="lg:col-span-8">
                  <SectionHeader title="Spending Velocity" icon={TrendingUp} />
                  <div className="grid sm:grid-cols-4 gap-4 mt-4">
                    {[
                      { label: 'Groceries', value: 85, color: 'bg-emerald-500' },
                      { label: 'Travel', value: 62, color: 'bg-navy-700' },
                      { label: 'Dining', value: 45, color: 'bg-amber-500' },
                      { label: 'Services', value: 30, color: 'bg-sky-500' },
                    ].map((cat, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-tighter">{cat.label}</span>
                          <span className="text-xs font-bold text-neutral-900">{cat.value}%</span>
                        </div>
                        <div className="h-2 w-full bg-light-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.value}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={`h-full ${cat.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-4 bg-navy-50 rounded-2xl border border-navy-100/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-navy-700 shadow-sm">
                          <Zap size={14} />
                       </div>
                       <p className="text-xs font-work-sans font-bold text-navy-900">Velocity limit: $5,000 / day</p>
                    </div>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-navy-700 hover:underline">Adjust Limit</button>
                  </div>
                </BentoCard>

                {/* Multi-Card Gallery */}
                <BentoCard className="lg:col-span-8">
                  <SectionHeader 
                    title="Card Gallery" 
                    icon={CreditCardIcon} 
                    action={<span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{cards.length} Assets</span>}
                  />
                  <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                    {cards.map((card, idx) => (
                      <motion.div 
                        key={card.id}
                        whileHover={{ y: -4 }}
                        onClick={() => setActiveCardIndex(idx)}
                        className={`min-w-[280px] p-6 rounded-[24px] cursor-pointer transition-all border-2 ${
                          activeCardIndex === idx 
                          ? 'border-navy-900 bg-navy-50/50 shadow-xl' 
                          : 'border-light-200 bg-white hover:border-navy-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-8 h-8 rounded-lg bg-white border border-light-100 flex items-center justify-center shadow-sm">
                             <CreditCardIcon size={16} className="text-navy-900" />
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full ${
                            card.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {card.status}
                          </span>
                        </div>
                        <p className="text-sm font-work-sans font-bold text-neutral-900">{card.card_type}</p>
                        <p className="text-xs text-neutral-400 font-gruppo mt-1">•••• {card.card_number?.slice(-4)}</p>
                        <div className="mt-6 flex items-baseline justify-between">
                          <p className="text-lg font-work-sans font-bold tabular-nums">${(card.balance || 0).toLocaleString()}</p>
                          <ChevronRight size={16} className={activeCardIndex === idx ? 'text-navy-900' : 'text-neutral-300'} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </BentoCard>

              </div>
            )}
          </div>
        </PageTransition>

        {/* Report Modal */}
        <AnimatePresence>
          {showReportModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-light-200"
              >
                <div className="p-8 border-b border-light-100 flex items-center justify-between bg-red-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-work-sans font-bold text-neutral-900">Emergency Suspend</h2>
                      <p className="text-xs text-red-600 font-bold uppercase tracking-widest mt-1">Immediate action required</p>
                    </div>
                  </div>
                  <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"><X size={24} /></button>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3">
                    <Info className="text-amber-600 shrink-0" size={20} />
                    <p className="text-xs text-amber-800 font-gruppo leading-relaxed">
                      Reporting an issue will **instantly disable** this card. A replacement with a new digital number will be issued automatically.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Nature of Incident</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['lost', 'stolen', 'damaged', 'other'].map(type => (
                          <button 
                            key={type}
                            onClick={() => setReportForm({...reportForm, issue_type: type as any})}
                            className={`py-3 px-4 rounded-xl border font-work-sans font-bold text-sm capitalize transition-all ${
                              reportForm.issue_type === type 
                              ? 'bg-navy-900 text-white border-navy-900' 
                              : 'bg-light-50 text-neutral-600 border-light-200 hover:border-navy-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Incident Description</label>
                      <textarea 
                        rows={3}
                        value={reportForm.description}
                        onChange={e => setReportForm({...reportForm, description: e.target.value})}
                        placeholder="Optional details for our investigation team..."
                        className="w-full p-4 bg-light-50 border border-light-200 rounded-2xl focus:outline-none focus:border-navy-700 font-work-sans text-sm resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={reportIssue}
                    className="w-full py-5 bg-red-600 text-white rounded-2xl font-work-sans font-bold text-base hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                  >
                    Confirm Suspension
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Credential Reveal - Separate Modal or Drawer */}
        <AnimatePresence>
          {showDetails && (
            <motion.div 
              initial={{ opacity: 0, x: 100 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 100 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] z-[100] border-l border-light-200 flex flex-col"
            >
              <div className="p-8 border-b border-light-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-work-sans font-bold text-neutral-900">Lane Credentials</h2>
                  <p className="text-[10px] text-navy-700 font-bold uppercase tracking-widest mt-1">Highly Sensitive View</p>
                </div>
                <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-light-50 rounded-full transition-colors"><X size={24} /></button>
              </div>

              <div className="p-8 space-y-8">
                <div className="p-6 bg-navy-950 rounded-[32px] text-white shadow-2xl overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-4 opacity-20"><Smartphone size={40} /></div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-navy-400 mb-6">Credential Surface</p>
                   <div className="space-y-6">
                      <div>
                        <p className="text-[10px] uppercase text-navy-500 font-bold tracking-tighter mb-1">Number</p>
                        <p className="text-xl font-mono tracking-widest font-bold">{activeCard.card_number}</p>
                      </div>
                      <div className="flex gap-12">
                        <div>
                          <p className="text-[10px] uppercase text-navy-500 font-bold tracking-tighter mb-1">Expiry</p>
                          <p className="text-lg font-mono font-bold">{activeCard.expiry_date}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-navy-500 font-bold tracking-tighter mb-1">CVV</p>
                          <p className="text-lg font-mono font-bold">{activeCard.cvv}</p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <SectionHeader title="Digital Provisioning" icon={Smartphone} />
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 bg-light-50 border border-light-200 rounded-2xl flex flex-col items-center gap-2 hover:bg-white hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center">🍎</div>
                      <span className="text-[10px] font-bold font-work-sans">Apple Pay</span>
                    </button>
                    <button className="p-4 bg-light-50 border border-light-200 rounded-2xl flex flex-col items-center gap-2 hover:bg-white hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center">G</div>
                      <span className="text-[10px] font-bold font-work-sans">Google Pay</span>
                    </button>
                  </div>
                </div>

                <div className="bg-light-50 rounded-2xl p-6 border border-light-100 flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Shield className="text-navy-700" size={24} />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-work-sans font-bold text-neutral-900">Virtual Isolation</p>
                      <p className="text-xs text-neutral-500 font-gruppo">This digital number is isolated from your physical card for added security.</p>
                   </div>
                </div>
              </div>

              <div className="mt-auto p-8 border-t border-light-100">
                 <button className="w-full py-4 bg-navy-900 text-white rounded-2xl font-work-sans font-bold text-sm">Update PIN</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
