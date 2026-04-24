"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Upload, Package, Camera, Check, X, Wallet, Clock, Shield } from "lucide-react";

function BentoCard({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={`relative bg-white border border-light-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${onClick ? "cursor-pointer hover:border-navy-700/40" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function ChecksPage() {
  const [tab, setTab] = useState<"order" | "deposit" | "history">("deposit");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = (side: "front" | "back", file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === "front") {
        setFrontImage(reader.result as string);
      } else {
        setBackImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeposit = () => {
    if (!frontImage || !backImage || !amount) {
      alert("Please capture both sides and enter amount");
      return;
    }
    alert(`Check deposit of $${amount} submitted successfully!`);
    setFrontImage(null);
    setBackImage(null);
    setAmount("");
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 pb-8">
          {/* Dark Hero Header */}
          <BentoCard className="overflow-hidden border-navy-800 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white p-0">
            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="relative">
                <p className="text-[11px] font-work-sans font-bold tracking-[0.16em] uppercase text-navy-200/80">
                  Check services
                </p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-work-sans font-bold tracking-tight">
                  Deposit, order, and track checks.
                </h1>
                <p className="mt-3 text-sm sm:text-base text-navy-100/75 font-gruppo max-w-xl">
                  Snap photos for instant mobile deposits, order new checkbooks, and review your deposit history from one unified surface.
                </p>
              </div>
            </div>
          </BentoCard>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BentoCard className="p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-work-sans font-bold tracking-[0.12em] uppercase text-neutral-500">Instant deposits</p>
                  <p className="mt-2 text-3xl font-work-sans font-bold text-neutral-900">24/7</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Camera size={20} />
                </div>
              </div>
            </BentoCard>
            <BentoCard className="p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-work-sans font-bold tracking-[0.12em] uppercase text-neutral-500">Clearing time</p>
                  <p className="mt-2 text-3xl font-work-sans font-bold text-neutral-900">1 day</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center">
                  <Clock size={20} />
                </div>
              </div>
            </BentoCard>
            <BentoCard className="p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-work-sans font-bold tracking-[0.12em] uppercase text-neutral-500">Fraud protection</p>
                  <p className="mt-2 text-3xl font-work-sans font-bold text-neutral-900">$0</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Shield size={20} />
                </div>
              </div>
            </BentoCard>
          </div>

          {/* Segmented Tab Navigation */}
          <div className="bg-white border border-light-200 rounded-2xl p-1.5 flex gap-1 shadow-sm">
            {[
              { key: "deposit" as const, label: "Deposit", icon: <Camera size={16} /> },
              { key: "order" as const, label: "Order", icon: <Package size={16} /> },
              { key: "history" as const, label: "History", icon: <FileText size={16} /> },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-work-sans font-semibold text-sm transition-all ${
                  tab === t.key
                    ? "bg-navy-800 text-white shadow-md"
                    : "text-neutral-500 hover:bg-light-100"
                }`}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
          {/* Mobile Deposit */}
          {tab === "deposit" && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700/30 rounded-2xl p-4 sm:p-6 text-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Camera className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-work-sans font-semibold text-base sm:text-lg mb-1">Quick Mobile Deposit</h3>
                    <p className="text-xs sm:text-sm text-navy-100/75 font-gruppo">
                      Snap photos of your check front and back. Funds available next business day.
                    </p>
                  </div>
                </div>
              </div>

              {/* Front Image Capture - Mobile First */}
              <div className="space-y-3">
                <label className="block text-sm font-medium px-1">Check Front</label>
                <div className="relative">
                  {!frontImage ? (
                    <button
                      onClick={() => frontInputRef.current?.click()}
                      className="w-full aspect-[16/9] border-3 border-dashed border-navy-200 rounded-2xl bg-light-50 hover:bg-light-100 hover:border-navy-300 transition-all active:scale-[0.98] flex flex-col items-center justify-center gap-3 p-6"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-navy-50 rounded-full flex items-center justify-center">
                        <Camera className="text-navy-700" size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-work-sans font-semibold text-base sm:text-lg mb-1 text-neutral-900">Capture Front</p>
                        <p className="text-xs sm:text-sm text-neutral-500 font-gruppo">
                          Tap to use camera or upload
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div className="relative group">
                      <Image
                        src={frontImage}
                        alt="Check front"
                        width={800}
                        height={450}
                        className="w-full aspect-[16/9] object-cover rounded-2xl border border-light-200"
                      />
                      <button
                        onClick={() => setFrontImage(null)}
                        className="absolute top-3 right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-400 transition-colors"
                      >
                        <X size={20} className="text-white" />
                      </button>
                      <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-emerald-500/90 rounded-full flex items-center gap-2">
                        <Check size={16} className="text-white" />
                        <span className="text-xs font-work-sans font-semibold text-white">Captured</span>
                      </div>
                    </div>
                  )}
                  <input
                    ref={frontInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageCapture("front", file);
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Back Image Capture - Mobile First */}
              <div className="space-y-3">
                <label className="block text-sm font-medium px-1">Check Back</label>
                <div className="relative">
                  {!backImage ? (
                    <button
                      onClick={() => backInputRef.current?.click()}
                      className="w-full aspect-[16/9] border-3 border-dashed border-navy-200 rounded-2xl bg-light-50 hover:bg-light-100 hover:border-navy-300 transition-all active:scale-[0.98] flex flex-col items-center justify-center gap-3 p-6"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-navy-50 rounded-full flex items-center justify-center">
                        <Camera className="text-navy-700" size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-work-sans font-semibold text-base sm:text-lg mb-1 text-neutral-900">Capture Back</p>
                        <p className="text-xs sm:text-sm text-neutral-500 font-gruppo">
                          Tap to use camera or upload
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div className="relative group">
                      <Image
                        src={backImage}
                        alt="Check back"
                        width={800}
                        height={450}
                        className="w-full aspect-[16/9] object-cover rounded-2xl border border-light-200"
                      />
                      <button
                        onClick={() => setBackImage(null)}
                        className="absolute top-3 right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-400 transition-colors"
                      >
                        <X size={20} className="text-white" />
                      </button>
                      <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-emerald-500/90 rounded-full flex items-center gap-2">
                        <Check size={16} className="text-white" />
                        <span className="text-xs font-work-sans font-semibold text-white">Captured</span>
                      </div>
                    </div>
                  )}
                  <input
                    ref={backInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageCapture("back", file);
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-3">
                <label className="block text-sm font-work-sans font-semibold px-1 text-neutral-900">Check Amount</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-neutral-400">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full pl-10 pr-5 py-4 sm:py-5 text-lg sm:text-xl font-work-sans font-semibold bg-light-50 border border-light-200 rounded-2xl focus:outline-none focus:border-navy-700 transition-colors text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>

              {/* Deposit Button */}
              <button
                onClick={handleDeposit}
                disabled={!frontImage || !backImage || !amount}
                className="w-full py-5 sm:py-6 bg-navy-700 hover:bg-navy-800 text-white rounded-2xl font-work-sans font-bold text-base sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Upload size={24} />
                <span>Deposit Check Now</span>
              </button>
            </motion.div>
          )}

          {/* Order Checks */}
          {tab === "order" && (
            <motion.div
              key="order"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-light-200 rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="text-navy-700" size={40} />
              </div>
              <h3 className="text-xl sm:text-2xl font-work-sans font-semibold text-center mb-3 text-neutral-900">Order Physical Checks</h3>
              <p className="text-sm sm:text-base text-neutral-500 text-center mb-8 font-gruppo">
                Personal checks delivered in 7&ndash;10 business days. Free with Everyday Checking.
              </p>
              <div className="max-w-md mx-auto space-y-5">
                <div>
                  <label className="block text-sm font-work-sans font-semibold mb-2 px-1 text-neutral-900">Design Style</label>
                  <select className="w-full px-4 sm:px-5 py-4 text-base bg-light-50 border border-light-200 rounded-xl focus:outline-none focus:border-navy-700 transition-colors text-neutral-900">
                    <option>Classic Navy</option>
                    <option>Executive White</option>
                    <option>Coastal Blue</option>
                    <option>Monogram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-work-sans font-semibold mb-2 px-1 text-neutral-900">Quantity</label>
                  <select className="w-full px-4 sm:px-5 py-4 text-base bg-light-50 border border-light-200 rounded-xl focus:outline-none focus:border-navy-700 transition-colors text-neutral-900">
                    <option>50 checks - $25</option>
                    <option>100 checks - $45</option>
                    <option>200 checks - $80</option>
                  </select>
                </div>
                <button className="w-full py-4 sm:py-5 bg-navy-700 hover:bg-navy-800 text-white rounded-xl font-work-sans font-bold text-base sm:text-lg transition-all shadow-lg active:scale-[0.98]">
                  Order Checks
                </button>
              </div>
            </motion.div>
          )}

          {/* History */}
          {tab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-light-200 rounded-2xl p-8 sm:p-12 text-center shadow-sm"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="text-navy-700" size={40} />
              </div>
              <p className="text-sm sm:text-base text-neutral-500 font-gruppo">No check history yet</p>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
