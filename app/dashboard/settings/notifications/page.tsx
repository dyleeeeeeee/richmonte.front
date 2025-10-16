"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, Bell, Mail, Smartphone } from "lucide-react";

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    email_transactions: true,
    email_bills: true,
    email_security: true,
    email_marketing: false,
    sms_transactions: false,
    sms_security: true,
    push_transactions: true,
    push_bills: true,
  });
  const [loading, setLoading] = useState(true);

  // Load existing notification preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && Object.keys(data).length > 0) {
            setSettings(data);
          }
        }
      } catch (error) {
        console.error("Failed to load notification preferences:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, []);

  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] });
  };

  const saveSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save notification preferences");
      }

      alert("Notification preferences saved!");
    } catch (error) {
      alert("Failed to save preferences. Please try again.");
      console.error(error);
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
              <h1 className="text-3xl font-work-sans font-bold text-neutral-900">Notification Settings</h1>
              <p className="text-neutral-600 font-gruppo">Manage your notification preferences</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="glass border border-gold-500/20 rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <Mail className="text-gold-600" size={24} />
                <h3 className="text-xl font-work-sans font-semibold text-neutral-900">Email Notifications</h3>
              </div>
              <div className="space-y-4">
                {[
                  { key: "email_transactions", label: "Transaction alerts", description: "Get notified about all transactions" },
                  { key: "email_bills", label: "Bill reminders", description: "Reminders for upcoming bill payments" },
                  { key: "email_security", label: "Security alerts", description: "Important security notifications" },
                  { key: "email_marketing", label: "Marketing emails", description: "Product updates and offers" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 glass hover:glass-gold rounded-lg transition-smooth">
                    <div>
                      <p className="font-work-sans font-medium text-neutral-900">{item.label}</p>
                      <p className="text-sm text-neutral-600 font-gruppo">{item.description}</p>
                    </div>
                    <button
                      onClick={() => toggleSetting(item.key)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        settings[item.key as keyof typeof settings] ? "bg-gradient-to-r from-gold-600 to-gold-700 shadow-md" : "bg-neutral-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          settings[item.key as keyof typeof settings] ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SMS Notifications */}
            <div className="glass border border-gold-500/20 rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <Smartphone className="text-gold-600" size={24} />
                <h3 className="text-xl font-work-sans font-semibold text-neutral-900">SMS Notifications</h3>
              </div>
              <div className="space-y-4">
                {[
                  { key: "sms_transactions", label: "Transaction alerts", description: "SMS for large transactions" },
                  { key: "sms_security", label: "Security alerts", description: "Critical security notifications" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 glass hover:glass-gold rounded-lg transition-smooth">
                    <div>
                      <p className="font-work-sans font-medium text-neutral-900">{item.label}</p>
                      <p className="text-sm text-neutral-600 font-gruppo">{item.description}</p>
                    </div>
                    <button
                      onClick={() => toggleSetting(item.key)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        settings[item.key as keyof typeof settings] ? "bg-gradient-to-r from-gold-600 to-gold-700 shadow-md" : "bg-neutral-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          settings[item.key as keyof typeof settings] ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Push Notifications */}
            <div className="glass border border-gold-500/20 rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="text-gold-600" size={24} />
                <h3 className="text-xl font-work-sans font-semibold text-neutral-900">Push Notifications</h3>
              </div>
              <div className="space-y-4">
                {[
                  { key: "push_transactions", label: "Transaction alerts", description: "Real-time transaction notifications" },
                  { key: "push_bills", label: "Bill reminders", description: "Push notifications for bills" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 glass hover:glass-gold rounded-lg transition-smooth">
                    <div>
                      <p className="font-work-sans font-medium text-neutral-900">{item.label}</p>
                      <p className="text-sm text-neutral-600 font-gruppo">{item.description}</p>
                    </div>
                    <button
                      onClick={() => toggleSetting(item.key)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        settings[item.key as keyof typeof settings] ? "bg-gradient-to-r from-gold-600 to-gold-700 shadow-md" : "bg-neutral-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          settings[item.key as keyof typeof settings] ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={saveSettings}
              className="w-full px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth shadow-lg shadow-gold-500/20 active:scale-95"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
