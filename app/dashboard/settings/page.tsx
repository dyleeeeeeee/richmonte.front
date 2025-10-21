"use client";

import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { User, Lock, Bell, Users, FileText, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const settings = [
    { icon: <User size={24} />, title: "Profile", description: "Update your personal information", href: "/dashboard/settings/profile" },
    { icon: <Lock size={24} />, title: "Security", description: "Password and login history", href: "/dashboard/settings/security" },
    { icon: <Bell size={24} />, title: "Notifications", description: "Email, SMS, and push preferences", href: "/dashboard/settings/notifications" },
    { icon: <Users size={24} />, title: "Beneficiaries", description: "Manage account beneficiaries", href: "/dashboard/settings/beneficiaries" },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 sm:space-y-8 pb-4">
          <div className="px-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-1 sm:mb-2 text-white">Settings</h1>
            <p className="text-sm sm:text-base text-gray-400">Manage your account preferences</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {settings.map((setting, idx) => (
              <button
                key={idx}
                onClick={() => router.push(setting.href)}
                className="p-6 bg-dark-800/30 border border-gold-500/10 rounded-xl hover:border-gold-500/40 transition-all text-left group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center text-gold-500 group-hover:bg-gold-500/30 transition-colors">
                      {setting.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">{setting.title}</h3>
                      <p className="text-sm text-gray-400">{setting.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-gold-500 transition-colors" size={24} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
