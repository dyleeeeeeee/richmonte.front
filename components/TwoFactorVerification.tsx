"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Shield, AlertCircle, Key } from "lucide-react";
import AnimatedButton from "@/components/AnimatedButton";

interface TwoFactorVerificationProps {
  email: string;
  userId: string;
  onVerify: (code: string) => Promise<void>;
  onUseBackupCode: () => void;
  onBack: () => void;
  error?: string;
  loading?: boolean;
}

export default function TwoFactorVerification({
  email,
  userId,
  onVerify,
  onUseBackupCode,
  onBack,
  error,
  loading = false
}: TwoFactorVerificationProps) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      await onVerify(otp);
    }
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-work-sans font-bold text-neutral-900 mb-2">
            Verify Your Identity
          </h1>
          <p className="text-neutral-600 font-gruppo">
            We&apos;ve sent a verification code to {maskedEmail}
          </p>
        </div>

        {/* Verification Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-neutral-200/60 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-work-sans font-semibold text-neutral-900 mb-3">
                Enter 6-digit code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) {
                      setOtp(value);
                    }
                  }}
                  placeholder="000000"
                  className="w-full text-center text-2xl font-mono font-bold tracking-widest bg-neutral-50 border-2 border-neutral-200 rounded-xl px-4 py-4 focus:outline-none focus:border-gold-500 transition-colors"
                  maxLength={6}
                  autoFocus
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-neutral-600 font-gruppo">
                  Code expires in <span className="font-mono font-semibold text-gold-600">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-red-600 font-gruppo">
                  Code has expired. Please try logging in again.
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800 font-gruppo">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <AnimatedButton
              type="submit"
              disabled={otp.length !== 6 || timeLeft <= 0 || loading}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-700 text-white py-3 rounded-xl font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </AnimatedButton>
          </form>

          {/* Alternative Options */}
          <div className="mt-6 pt-6 border-t border-neutral-200 space-y-3">
            <button
              onClick={onUseBackupCode}
              className="w-full flex items-center justify-center space-x-2 py-2 text-gold-600 hover:text-gold-700 font-work-sans font-medium transition-colors"
            >
              <Key size={16} />
              <span>Use backup code instead</span>
            </button>

            <button
              onClick={onBack}
              className="w-full flex items-center justify-center space-x-2 py-2 text-neutral-600 hover:text-neutral-700 font-work-sans font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to login</span>
            </button>
          </div>
        </motion.div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-xs text-neutral-500 font-gruppo">
            Didn&apos;t receive the code? Check your spam folder or{" "}
            <button className="text-gold-600 hover:text-gold-700 underline">
              request a new one
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
