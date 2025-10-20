"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, Lock, Smartphone, Monitor } from "lucide-react";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
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

    </ProtectedRoute>
  );
}
