"use client";

import { useState } from "react";
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

  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] });
  };

  const saveSettings = () => {
    alert("Notification preferences saved!");
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
              <h1 className="text-3xl font-serif font-bold">Notification Settings</h1>
              <p className="text-gray-400">Manage your notification preferences</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Mail className="text-gold-500" size={24} />
                <h3 className="text-xl font-semibold">Email Notifications</h3>
              </div>
              <div className="space-y-4">
                {[
                  { key: "email_transactions", label: "Transaction alerts", description: "Get notified about all transactions" },
                  { key: "email_bills", label: "Bill reminders", description: "Reminders for upcoming bill payments" },
                  { key: "email_security", label: "Security alerts", description: "Important security notifications" },
                  { key: "email_marketing", label: "Marketing emails", description: "Product updates and offers" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                    <button
                      onClick={() => toggleSetting(item.key)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        settings[item.key as keyof typeof settings] ? "bg-gold-500" : "bg-dark-700"
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
            <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Smartphone className="text-gold-500" size={24} />
                <h3 className="text-xl font-semibold">SMS Notifications</h3>
              </div>
              <div className="space-y-4">
                {[
                  { key: "sms_transactions", label: "Transaction alerts", description: "SMS for large transactions" },
                  { key: "sms_security", label: "Security alerts", description: "Critical security notifications" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                    <button
                      onClick={() => toggleSetting(item.key)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        settings[item.key as keyof typeof settings] ? "bg-gold-500" : "bg-dark-700"
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
            <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="text-gold-500" size={24} />
                <h3 className="text-xl font-semibold">Push Notifications</h3>
              </div>
              <div className="space-y-4">
                {[
                  { key: "push_transactions", label: "Transaction alerts", description: "Real-time transaction notifications" },
                  { key: "push_bills", label: "Bill reminders", description: "Push notifications for bills" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                    <button
                      onClick={() => toggleSetting(item.key)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        settings[item.key as keyof typeof settings] ? "bg-gold-500" : "bg-dark-700"
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
              className="w-full px-6 py-3 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
