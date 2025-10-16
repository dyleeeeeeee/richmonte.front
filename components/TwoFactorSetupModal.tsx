"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Shield, AlertTriangle } from "lucide-react";
import AnimatedButton from "@/components/AnimatedButton";

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  backupCodes: string[];
  onConfirm: () => void;
}

export default function TwoFactorSetupModal({
  isOpen,
  onClose,
  backupCodes,
  onConfirm
}: TwoFactorSetupModalProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyAllCodes = async () => {
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'));
      setCopiedCode('all');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleConfirm = () => {
    if (confirmed) {
      onConfirm();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl border border-neutral-200/60 w-full max-w-lg mx-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gold-500 to-gold-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8" />
                    <div>
                      <h2 className="text-xl font-work-sans font-bold">2FA Setup Complete</h2>
                      <p className="text-gold-100 text-sm">Save your backup codes</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-work-sans font-semibold text-amber-800 mb-1">
                        Important Security Notice
                      </h3>
                      <p className="text-sm text-amber-700">
                        These backup codes can be used to access your account if you lose access to your email.
                        Store them in a safe place and never share them with anyone.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Backup Codes */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-work-sans font-semibold text-neutral-900">
                      Your Backup Codes
                    </h3>
                    <button
                      onClick={copyAllCodes}
                      className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                    >
                      <Copy size={14} />
                      <span>{copiedCode === 'all' ? 'Copied!' : 'Copy All'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-lg font-mono text-sm"
                      >
                        <span className="text-neutral-900">{code}</span>
                        <button
                          onClick={() => copyToClipboard(code)}
                          className="p-1 hover:bg-neutral-200 rounded transition-colors"
                        >
                          {copiedCode === code ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} className="text-neutral-500" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirmation */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="mt-1 w-4 h-4 text-gold-600 bg-white border-neutral-300 rounded focus:ring-gold-500 focus:ring-2"
                    />
                    <div>
                      <span className="text-sm font-work-sans text-neutral-900">
                        I have saved my backup codes in a secure location
                      </span>
                      <p className="text-xs text-neutral-600 mt-1">
                        You won&apos;t be able to see these codes again
                      </p>
                    </div>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-work-sans font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <AnimatedButton
                    onClick={handleConfirm}
                    disabled={!confirmed}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    I&apos;ve Saved My Codes
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
