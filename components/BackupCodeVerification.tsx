"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Key, AlertCircle } from "lucide-react";
import AnimatedButton from "@/components/AnimatedButton";

interface BackupCodeVerificationProps {
  email: string;
  userId: string;
  onVerify: (code: string) => Promise<void>;
  onBack: () => void;
  error?: string;
  loading?: boolean;
}

export default function BackupCodeVerification({
  email,
  userId,
  onVerify,
  onBack,
  error,
  loading = false
}: BackupCodeVerificationProps) {
  const [backupCode, setBackupCode] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (backupCode.trim()) {
      await onVerify(backupCode.trim());
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
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-work-sans font-bold text-neutral-900 mb-2">
            Enter Backup Code
          </h1>
          <p className="text-neutral-600 font-gruppo">
            Use one of your backup codes for {maskedEmail}
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
            {/* Backup Code Input */}
            <div>
              <label className="block text-sm font-work-sans font-semibold text-neutral-900 mb-3">
                Backup code
              </label>
              <input
                type="text"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value)}
                placeholder="Enter your backup code"
                className="w-full text-center font-mono text-lg bg-neutral-50 border-2 border-neutral-200 rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500 transition-colors"
                autoFocus
              />
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 font-gruppo text-center">
                Each backup code can only be used once. Make sure to save your remaining codes.
              </p>
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
              disabled={!backupCode.trim() || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-work-sans font-semibold hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Verifying..." : "Verify Backup Code"}
            </AnimatedButton>
          </form>

          {/* Back Button */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <button
              onClick={onBack}
              className="w-full flex items-center justify-center space-x-2 py-2 text-neutral-600 hover:text-neutral-700 font-work-sans font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to verification</span>
            </button>
          </div>
        </motion.div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-xs text-neutral-500 font-gruppo">
            Need help? Contact{" "}
            <a href="mailto:support@conciergebank.us" className="text-blue-600 hover:text-blue-700 underline">
              support@conciergebank.us
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
