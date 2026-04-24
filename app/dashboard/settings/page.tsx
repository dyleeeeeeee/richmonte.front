"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { User, Lock, Bell, Users, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const settings = [
    {
      icon: <User size={20} />,
      title: "Profile",
      description: "Update your personal information",
      href: "/dashboard/settings/profile",
      accent: "bg-navy-50 text-navy-700",
    },
    {
      icon: <Lock size={20} />,
      title: "Security",
      description: "Password and login history",
      href: "/dashboard/settings/security",
      accent: "bg-amber-50 text-amber-700",
    },
    {
      icon: <Bell size={20} />,
      title: "Notifications",
      description: "Email, SMS, and push preferences",
      href: "/dashboard/settings/notifications",
      accent: "bg-blue-50 text-blue-700",
    },
    {
      icon: <Users size={20} />,
      title: "Beneficiaries",
      description: "Manage account beneficiaries",
      href: "/dashboard/settings/beneficiaries",
      accent: "bg-emerald-50 text-emerald-700",
    },
  ];

  function BentoTile({ children, className = "", onClick }: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={onClick}
        className={`relative rounded-2xl border border-light-300/80 bg-white text-neutral-900 shadow-sm p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-navy-700/40 ${onClick ? "cursor-pointer" : ""} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-5 sm:space-y-6">
          <div>
            <p className="text-[11px] font-work-sans font-bold tracking-[0.12em] uppercase text-neutral-500">
              Account center
            </p>
            <h1 className="text-2xl sm:text-3xl font-work-sans font-bold text-neutral-900 mt-1">
              Settings
            </h1>
            <p className="text-sm text-neutral-500 font-gruppo mt-1">
              Manage your account preferences
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
            {settings.map((setting, idx) => (
              <BentoTile
                key={idx}
                onClick={() => router.push(setting.href)}
                className="group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${setting.accent}`}>
                      {setting.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-work-sans font-semibold text-neutral-900 mb-1">
                        {setting.title}
                      </h3>
                      <p className="text-sm text-neutral-500 font-gruppo">
                        {setting.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-neutral-400 group-hover:text-navy-700 transition-colors" size={20} />
                </div>
              </BentoTile>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
