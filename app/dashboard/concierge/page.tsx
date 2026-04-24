"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Send, Sparkles, User, Bot, 
  ChevronRight, Calendar, Landmark, Shield, 
  Headphones, CreditCard, PieChart, Plus, X
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { conciergeAPI, ConciergeMessage, ConciergeRequest } from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";

// ══════════════════════════════════════════════════════════════════════════
// Components
// ══════════════════════════════════════════════════════════════════════════

function BentoCard({ 
  children, 
  className = "", 
  tone = "light",
  padding = "default"
}: { 
  children: React.ReactNode; 
  className?: string; 
  tone?: "light" | "dark";
  padding?: "default" | "tight" | "none";
}) {
  const base = tone === "dark" 
    ? "bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white border-navy-800" 
    : "bg-white text-neutral-900 border-light-200/80 shadow-sm";
  
  const pad = padding === "none" ? "" : padding === "tight" ? "p-4" : "p-6";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative border rounded-[24px] overflow-hidden ${base} ${pad} ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Page
// ══════════════════════════════════════════════════════════════════════════

export default function ConciergePage() {
  const { showNotification } = useNotification();
  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState("travel");
  const [requestDetails, setRequestDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    try {
      const response = await conciergeAPI.sendMessage(userMessage);
      if (response.data) {
        setMessages(prev => [...prev, response.data!]);
      } else {
        showNotification("Failed to reach concierge assistant", "error");
      }
    } catch (err) {
      showNotification("Connection error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestDetails.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await conciergeAPI.createRequest({
        type: requestType,
        details: requestDetails
      });
      if (response.data) {
        showNotification("Request submitted to our concierge team!", "success");
        setShowRequestModal(false);
        setRequestDetails("");
      } else {
        showNotification("Failed to submit request", "error");
      }
    } catch (err) {
      showNotification("Connection error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const suggestions = [
    "Check my portfolio performance",
    "Book a travel reservation",
    "Explain my latest bill",
    "Set a spending limit on my card",
    "Contact wealth management"
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageTransition>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
            
            {/* Left: Chat Interface */}
            <BentoCard className="lg:col-span-8 flex flex-col p-0 h-full overflow-hidden border-navy-100/50">
              <div className="p-6 border-b border-light-100 flex items-center justify-between bg-white/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center shadow-lg">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-work-sans font-bold text-neutral-900 leading-none">InvBank Assistant</h2>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Available 24/7</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-2 hover:bg-light-50 rounded-xl transition-colors text-neutral-400"><Shield size={20}/></button>
                </div>
              </div>

              {/* Chat Content */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-neutral-50/30">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-sm mx-auto">
                    <div className="w-16 h-16 rounded-[24px] bg-white border border-light-200 flex items-center justify-center shadow-sm">
                      <Sparkles className="text-navy-700" size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-work-sans font-bold text-neutral-900">How can I assist you today?</h3>
                      <p className="text-sm text-neutral-500 font-gruppo mt-2">
                        Your dedicated AI assistant is ready to help with account management, luxury services, and investment insights.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestions.map(s => (
                        <button 
                          key={s}
                          onClick={() => setInput(s)}
                          className="px-4 py-2 bg-white border border-light-200 rounded-full text-xs font-work-sans font-semibold text-neutral-700 hover:border-navy-700 hover:bg-navy-50 transition-all shadow-sm"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div key={m.id || i} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-navy-900 text-white p-4 rounded-[20px] rounded-tr-none shadow-md">
                        <p className="text-sm font-work-sans leading-relaxed">{m.message}</p>
                      </div>
                    </div>
                    {/* Assistant Message */}
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-lg bg-white border border-light-200 flex items-center justify-center shrink-0 shadow-sm mt-1">
                          <Bot size={16} className="text-navy-700" />
                        </div>
                        <div className="bg-white border border-light-200 p-4 rounded-[20px] rounded-tl-none shadow-sm">
                          <p className="text-sm text-neutral-800 font-work-sans leading-relaxed">{m.response}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-light-200 flex items-center justify-center shrink-0 shadow-sm mt-1">
                        <Bot size={16} className="text-navy-700" />
                      </div>
                      <div className="bg-white border border-light-200 p-4 rounded-[20px] rounded-tl-none shadow-sm flex gap-1">
                        <span className="w-1.5 h-1.5 bg-navy-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-navy-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-navy-300 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t border-light-100">
                <form onSubmit={handleSendMessage} className="relative">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full pl-6 pr-14 py-4 bg-light-50 border border-light-200 rounded-[20px] focus:outline-none focus:border-navy-700 font-work-sans text-sm transition-all shadow-inner"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="absolute right-2 top-2 w-10 h-10 bg-navy-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all active:scale-90 disabled:opacity-30 shadow-lg"
                  >
                    <Send size={18} />
                  </button>
                </form>
                <p className="text-[10px] text-center text-neutral-400 font-gruppo mt-4 uppercase tracking-[0.2em]">
                  Encrypted & Private · InvBank AI System
                </p>
              </div>
            </BentoCard>

            {/* Right: Quick Requests & Info */}
            <div className="lg:col-span-4 space-y-6 h-full flex flex-col">
              <BentoCard tone="dark" className="shrink-0 shadow-2xl shadow-navy-950/20 overflow-hidden">
                <div className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 bg-sky-500/10 blur-2xl" />
                <h3 className="text-xl font-work-sans font-bold mb-4 flex items-center gap-2">
                  <Headphones size={20} className="text-sky-300" />
                  Premium Services
                </h3>
                <p className="text-sm text-navy-100/60 font-gruppo mb-6 leading-relaxed">
                  Access 24/7 priority support for travel, dining, and lifestyle management.
                </p>
                <button 
                  onClick={() => setShowRequestModal(true)}
                  className="w-full py-4 bg-white text-navy-900 rounded-xl font-work-sans font-bold text-sm hover:bg-navy-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Plus size={18} /> New Service Request
                </button>
              </BentoCard>

              <BentoCard className="flex-1 space-y-6">
                <h3 className="text-xs font-work-sans font-bold uppercase tracking-widest text-neutral-400">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: "Book Travel", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Dining Reservations", icon: Landmark, color: "text-orange-600", bg: "bg-orange-50" },
                    { label: "Lifestyle Management", icon: User, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Wealth Advisory", icon: PieChart, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Report Card Issue", icon: CreditCard, color: "text-red-600", bg: "bg-red-50" },
                  ].map((item, i) => (
                    <button 
                      key={i}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-light-50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg ${item.bg} ${item.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                          <item.icon size={18} />
                        </div>
                        <span className="text-sm font-work-sans font-semibold text-neutral-700">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </BentoCard>
            </div>

          </div>
        </PageTransition>

        {/* Service Request Modal */}
        <AnimatePresence>
          {showRequestModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-light-200"
              >
                <div className="p-8 border-b border-light-100 flex items-center justify-between">
                  <h2 className="text-2xl font-work-sans font-bold text-neutral-900">New Request</h2>
                  <button onClick={() => setShowRequestModal(false)} className="p-2 hover:bg-light-100 rounded-full transition-colors"><X size={24} /></button>
                </div>
                
                <form onSubmit={handleCreateRequest} className="p-8 space-y-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Request Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['travel', 'dining', 'lifestyle', 'wealth', 'other'].map(t => (
                        <button 
                          key={t}
                          type="button"
                          onClick={() => setRequestType(t)}
                          className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${requestType === t ? "bg-navy-900 border-navy-900 text-white shadow-lg" : "border-light-200 text-neutral-500 hover:border-navy-200"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Details</label>
                    <textarea 
                      required
                      value={requestDetails}
                      onChange={(e) => setRequestDetails(e.target.value)}
                      placeholder="Please describe your request in detail..."
                      className="w-full p-4 bg-light-50 border border-light-200 rounded-2xl focus:outline-none focus:border-navy-700 font-work-sans text-sm min-h-[120px] shadow-inner"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-navy-900 text-white rounded-2xl font-work-sans font-bold hover:bg-black transition-all disabled:opacity-50 shadow-xl active:scale-[0.98]"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
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
