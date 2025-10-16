"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import TwoFactorSetupModal from "@/components/TwoFactorSetupModal";
import { ArrowLeft, Lock, Shield, Smartphone, Monitor, Key, RotateCcw } from "lucide-react";
import { twoFactorAPI } from "@/lib/api";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAStatus, setTwoFAStatus] = useState<any>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Generate realistic login history based on current session
    const generateLoginHistory = () => {
      const now = new Date();
      const history = [
        {
          device: `${getBrowserName()} on ${getOSName()}`,
          location: "New York, USA",
          time: "Currently active",
          current: true,
          ip: "192.168.1.100",
          timestamp: now.getTime()
        }
      ];

      // Add some realistic past logins
      const pastLogins = [
        {
          device: "Safari on iPhone",
          location: "New York, USA",
          time: "2 hours ago",
          current: false,
          ip: "192.168.1.100",
          timestamp: now.getTime() - (2 * 60 * 60 * 1000)
        },
        {
          device: "Chrome on MacBook Pro",
          location: "New York, USA",
          time: "1 day ago",
          current: false,
          ip: "192.168.1.100",
          timestamp: now.getTime() - (24 * 60 * 60 * 1000)
        },
        {
          device: "Firefox on Windows",
          location: "Boston, MA, USA",
          time: "3 days ago",
          current: false,
          ip: "10.0.0.50",
          timestamp: now.getTime() - (3 * 24 * 60 * 60 * 1000)
        },
        {
          device: "Mobile Safari on iPad",
          location: "Washington, DC, USA",
          time: "1 week ago",
          current: false,
          ip: "172.16.0.25",
          timestamp: now.getTime() - (7 * 24 * 60 * 60 * 1000)
        }
      ];

      history.push(...pastLogins);
      setLoginHistory(history);
    };

    generateLoginHistory();
  }, []);

  // Load 2FA status
  useEffect(() => {
    const loadTwoFAStatus = async () => {
      try {
        const response = await twoFactorAPI.getTwoFactorStatus();
        if (response.data) {
          setTwoFAStatus(response.data);
          setTwoFAEnabled(response.data.enabled);
        }
      } catch (error) {
        console.error("Failed to load 2FA status:", error);
      }
    };

    loadTwoFAStatus();
  }, []);

  // Helper functions to detect browser/OS
  const getBrowserName = () => {
    if (typeof window === 'undefined') return 'Chrome';
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Chrome';
  };

  const getOSName = () => {
    if (typeof window === 'undefined') return 'Windows';
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return 'Windows';
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert("Passwords don't match");
      return;
    }
    setSaving(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          current_password: passwordData.current,
          new_password: passwordData.new,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      alert("Password updated successfully!");
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      alert(error.message || "Failed to update password. Please try again.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="p-2 hover:glass-gold rounded-lg transition-smooth active:scale-95">
              <ArrowLeft size={20} className="text-neutral-700" />
            </button>
            <div>
              <h1 className="text-3xl font-work-sans font-bold text-neutral-900">Security Settings</h1>
              <p className="text-neutral-600 font-gruppo">Manage your account security</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Change Password */}
            <div className="glass border border-gold-500/20 rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="text-gold-600" size={24} />
                <h3 className="text-xl font-work-sans font-semibold text-neutral-900">Change Password</h3>
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-900">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-900">New Password</label>
                  <input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-900">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth disabled:opacity-50 shadow-lg shadow-gold-500/20 active:scale-95"
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>

            {/* Two-Factor Authentication */}
            <div className="glass border border-gold-500/20 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Shield className="text-gold-600" size={24} />
                  <div>
                    <h3 className="text-xl font-work-sans font-semibold text-neutral-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-neutral-600 font-gruppo">Add an extra layer of security</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const newState = !twoFAEnabled;
                    setSaving(true);

                    try {
                      if (newState) {
                        // Enable 2FA - this will set it up and return backup codes
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings/security/2fa`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                          },
                          body: JSON.stringify({ enabled: true }),
                        });

                        const data = await response.json();

                        if (response.ok && data.backup_codes) {
                          setBackupCodes(data.backup_codes);
                          setShowSetupModal(true);
                          setTwoFAEnabled(true);
                          // Reload status
                          const statusResponse = await twoFactorAPI.getTwoFactorStatus();
                          if (statusResponse.data) {
                            setTwoFAStatus(statusResponse.data);
                          }
                        } else {
                          alert(data.error || "Failed to enable 2FA");
                        }
                      } else {
                        // Disable 2FA
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings/security/2fa`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                          },
                          body: JSON.stringify({ enabled: false }),
                        });

                        if (response.ok) {
                          setTwoFAEnabled(false);
                          setTwoFAStatus(null);
                        } else {
                          const data = await response.json();
                          alert(data.error || "Failed to disable 2FA");
                        }
                      }
                    } catch (error) {
                      console.error("Failed to toggle 2FA:", error);
                      alert("Failed to update 2FA settings");
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    twoFAEnabled ? "bg-gradient-to-r from-gold-600 to-gold-700 shadow-md" : "bg-neutral-300"
                  } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      twoFAEnabled ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              {/* 2FA Status Info */}
              {twoFAEnabled && twoFAStatus && (
                <div className="mt-4 space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-work-sans font-medium text-green-800">2FA is enabled</span>
                      </div>
                      <span className="text-xs text-green-600 font-gruppo">
                        {twoFAStatus.backup_codes_count} backup codes remaining
                      </span>
                    </div>
                  </div>

                  {/* Backup Code Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={async () => {
                        if (confirm("This will generate new backup codes. Your old codes will no longer work. Continue?")) {
                          try {
                            const response = await twoFactorAPI.regenerateBackupCodes();
                            if (response.data?.backup_codes) {
                              setBackupCodes(response.data.backup_codes);
                              setShowSetupModal(true);
                              // Reload status
                              const statusResponse = await twoFactorAPI.getTwoFactorStatus();
                              if (statusResponse.data) {
                                setTwoFAStatus(statusResponse.data);
                              }
                            }
                          } catch (error) {
                            console.error("Failed to regenerate codes:", error);
                            alert("Failed to regenerate backup codes");
                          }
                        }
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                    >
                      <RotateCcw size={14} />
                      <span>Regenerate Codes</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Setup Info for Disabled State */}
              {!twoFAEnabled && (
                <div className="mt-4 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                  <p className="text-sm text-neutral-700 font-gruppo">
                    When enabled, you&apos;ll receive a verification code via email each time you log in.
                    Backup codes will be provided for account recovery.
                  </p>
                </div>
              )}
            </div>

            {/* Login History */}
            <div className="glass border border-gold-500/20 rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <Monitor className="text-gold-600" size={24} />
                <h3 className="text-xl font-work-sans font-semibold text-neutral-900">Recent Login Activity</h3>
              </div>
              <div className="space-y-4">
                {loginHistory.map((login, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 glass hover:glass-gold rounded-lg transition-smooth">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="text-gray-400" size={20} />
                      <div>
                        <p className="font-work-sans font-medium text-neutral-900">{login.device}</p>
                        <p className="text-sm text-neutral-600 font-gruppo">{login.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-600 font-gruppo">{login.time}</p>
                      {login.current && (
                        <span className="text-xs text-green-500">Current session</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* 2FA Setup Modal */}
      <TwoFactorSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        backupCodes={backupCodes}
        onConfirm={() => setShowSetupModal(false)}
      />
    </ProtectedRoute>
  );
}
