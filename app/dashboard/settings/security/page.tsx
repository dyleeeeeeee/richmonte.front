"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, Lock, Shield, Smartphone, Monitor } from "lucide-react";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert("Passwords don't match");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      alert("Password updated successfully!");
      setPasswordData({ current: "", new: "", confirm: "" });
      setSaving(false);
    }, 1000);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-dark-700 rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-serif font-bold">Security Settings</h1>
              <p className="text-gray-400">Manage your account security</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Change Password */}
            <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="text-gold-500" size={24} />
                <h3 className="text-xl font-semibold">Change Password</h3>
              </div>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 text-white placeholder:text-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full px-6 py-3 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400 disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Shield className="text-gold-500" size={24} />
                  <div>
                    <h3 className="text-xl font-semibold">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-400">Add an extra layer of security</p>
                  </div>
                </div>
                <button
                  onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    twoFAEnabled ? "bg-gold-500" : "bg-dark-700"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      twoFAEnabled ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
              {twoFAEnabled && (
                <div className="mt-4 p-4 bg-dark-900 rounded-lg">
                  <p className="text-sm text-gray-400">Scan this QR code with your authenticator app</p>
                  <div className="w-40 h-40 bg-white mx-auto my-4 rounded-lg"></div>
                </div>
              )}
            </div>

            {/* Login History */}
            <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Monitor className="text-gold-500" size={24} />
                <h3 className="text-xl font-semibold">Recent Login Activity</h3>
              </div>
              <div className="space-y-4">
                {[
                  { device: "Chrome on Windows", location: "New York, USA", time: "2 hours ago", current: true },
                  { device: "Safari on iPhone", location: "New York, USA", time: "1 day ago", current: false },
                ].map((login, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="text-gray-400" size={20} />
                      <div>
                        <p className="font-medium">{login.device}</p>
                        <p className="text-sm text-gray-400">{login.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{login.time}</p>
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
    </ProtectedRoute>
  );
}
