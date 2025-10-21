"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Upload, Package, Camera, Check, X } from "lucide-react";

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
          {/* Header - Mobile Optimized */}
          <div className="px-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-1 text-white">Checks</h1>
            <p className="text-sm sm:text-base text-gray-400">Deposit checks instantly</p>
          </div>

          {/* Modern Tab Navigation - Mobile Optimized */}
          <div className="bg-dark-800/50 border border-gold-500/20 rounded-2xl p-1.5 grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setTab("deposit")}
              className={`px-3 py-3 sm:px-6 sm:py-3.5 rounded-xl font-medium text-sm sm:text-base transition-all ${
                tab === "deposit"
                  ? "bg-gradient-to-br from-gold-500 to-gold-600 text-dark-900 shadow-lg"
                  : "text-gray-300 hover:bg-dark-700/50"
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setTab("order")}
              className={`px-3 py-3 sm:px-6 sm:py-3.5 rounded-xl font-medium text-sm sm:text-base transition-all ${
                tab === "order"
                  ? "bg-gradient-to-br from-gold-500 to-gold-600 text-dark-900 shadow-lg"
                  : "text-gray-300 hover:bg-dark-700/50"
              }`}
            >
              Order
            </button>
            <button
              onClick={() => setTab("history")}
              className={`px-3 py-3 sm:px-6 sm:py-3.5 rounded-xl font-medium text-sm sm:text-base transition-all ${
                tab === "history"
                  ? "bg-gradient-to-br from-gold-500 to-gold-600 text-dark-900 shadow-lg"
                  : "text-gray-300 hover:bg-dark-700/50"
              }`}
            >
              History
            </button>
          </div>

          {/* Mobile Deposit - Optimized for Camera */}
          {tab === "deposit" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gold-500/10 to-gold-600/10 border border-gold-500/30 rounded-2xl p-4 sm:p-6">
                <div className="flex items-start space-x-3 mb-3">
                  <Camera className="text-gold-500 flex-shrink-0 mt-0.5" size={24} />
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-1">Quick Mobile Deposit</h3>
                    <p className="text-xs sm:text-sm text-gray-300">
                      Snap photos of your check front and back. Funds available instantly.
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
                      className="w-full aspect-[16/9] border-3 border-dashed border-gold-500/40 rounded-2xl bg-dark-800/30 hover:bg-dark-800/50 hover:border-gold-500/60 transition-all active:scale-[0.98] flex flex-col items-center justify-center space-y-3 p-6"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gold-500/20 rounded-full flex items-center justify-center">
                        <Camera className="text-gold-500" size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-base sm:text-lg mb-1">Capture Front</p>
                        <p className="text-xs sm:text-sm text-gray-400">
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
                        className="w-full aspect-[16/9] object-cover rounded-2xl border border-gold-500/30"
                      />
                      <button
                        onClick={() => setFrontImage(null)}
                        className="absolute top-3 right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-400 transition-colors"
                      >
                        <X size={20} className="text-white" />
                      </button>
                      <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-green-500/90 rounded-full flex items-center space-x-2">
                        <Check size={16} className="text-white" />
                        <span className="text-xs font-semibold text-white">Captured</span>
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
                      className="w-full aspect-[16/9] border-3 border-dashed border-gold-500/40 rounded-2xl bg-dark-800/30 hover:bg-dark-800/50 hover:border-gold-500/60 transition-all active:scale-[0.98] flex flex-col items-center justify-center space-y-3 p-6"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gold-500/20 rounded-full flex items-center justify-center">
                        <Camera className="text-gold-500" size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-base sm:text-lg mb-1">Capture Back</p>
                        <p className="text-xs sm:text-sm text-gray-400">
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
                        className="w-full aspect-[16/9] object-cover rounded-2xl border border-gold-500/30"
                      />
                      <button
                        onClick={() => setBackImage(null)}
                        className="absolute top-3 right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-400 transition-colors"
                      >
                        <X size={20} className="text-white" />
                      </button>
                      <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-green-500/90 rounded-full flex items-center space-x-2">
                        <Check size={16} className="text-white" />
                        <span className="text-xs font-semibold text-white">Captured</span>
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

              {/* Amount Input - Mobile Optimized */}
              <div className="space-y-3">
                <label className="block text-sm font-medium px-1">Check Amount</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gray-400">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full pl-10 pr-5 py-4 sm:py-5 text-lg sm:text-xl font-semibold bg-dark-900 border border-gold-500/20 rounded-2xl focus:outline-none focus:border-gold-500 transition-colors text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Deposit Button - Large Touch Target */}
              <button
                onClick={handleDeposit}
                disabled={!frontImage || !backImage || !amount}
                className="w-full py-5 sm:py-6 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 rounded-2xl font-bold text-base sm:text-lg hover:from-gold-400 hover:to-gold-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <Upload size={24} />
                <span>Deposit Check Now</span>
              </button>
            </div>
          )}

          {/* Order Checks - Mobile Optimized */}
          {tab === "order" && (
            <div className="bg-dark-800/30 border border-gold-500/10 rounded-2xl p-6 sm:p-8">
              <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gold-500 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-semibold text-center mb-3">Order Physical Checks</h3>
              <p className="text-sm sm:text-base text-gray-400 text-center mb-8">
                Customize checks with Richemont brand designs
              </p>
              <div className="max-w-md mx-auto space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 px-1">Design Style</label>
                  <select className="w-full px-4 sm:px-5 py-4 text-base bg-dark-900 border border-gold-500/20 rounded-xl focus:outline-none focus:border-gold-500 transition-colors text-white">
                    <option className="text-white">Cartier Classic</option>
                    <option className="text-white">Van Cleef Elegance</option>
                    <option className="text-white">Montblanc Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 px-1">Quantity</label>
                  <select className="w-full px-4 sm:px-5 py-4 text-base bg-dark-900 border border-gold-500/20 rounded-xl focus:outline-none focus:border-gold-500 transition-colors text-white">
                    <option className="text-white">50 checks - $25</option>
                    <option className="text-white">100 checks - $45</option>
                    <option className="text-white">200 checks - $80</option>
                  </select>
                </div>
                <button className="w-full py-4 sm:py-5 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 rounded-xl font-bold text-base sm:text-lg hover:from-gold-400 hover:to-gold-500 transition-all shadow-lg active:scale-[0.98]">
                  Order Checks
                </button>
              </div>
            </div>
          )}

          {/* History - Mobile Optimized */}
          {tab === "history" && (
            <div className="bg-dark-800/30 border border-gold-500/10 rounded-2xl p-8 sm:p-12 text-center">
              <FileText className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-400">No check history yet</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
