"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, ArrowLeft } from "lucide-react";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    address: "",
    preferred_brand: user?.preferred_brand || "Cartier",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
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
              <h1 className="text-3xl font-work-sans font-bold text-neutral-900">Profile Settings</h1>
              <p className="text-neutral-600 font-gruppo">Update your personal information</p>
            </div>
          </div>

          <div className="glass border border-gold-500/20 rounded-xl p-8 space-y-6 shadow-lg">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-work-sans font-bold text-white">{user?.full_name?.charAt(0) || "U"}</span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-br from-gold-600 to-gold-700 rounded-full flex items-center justify-center hover:from-gold-500 hover:to-gold-600 transition-smooth shadow-md active:scale-95">
                  <Camera size={16} className="text-white" />
                </button>
              </div>
              <div>
                <h3 className="font-work-sans font-semibold mb-1 text-neutral-900">{user?.full_name}</h3>
                <p className="text-sm text-neutral-600 font-gruppo">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-900">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-900">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-900">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-900">Preferred Richemont Brand</label>
                <select
                  value={formData.preferred_brand}
                  onChange={(e) => setFormData({ ...formData, preferred_brand: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 shadow-inner"
                >
                  <option value="Cartier" className="text-neutral-900">Cartier</option>
                  <option value="Van Cleef & Arpels" className="text-neutral-900">Van Cleef & Arpels</option>
                  <option value="Montblanc" className="text-neutral-900">Montblanc</option>
                  <option value="Jaeger-LeCoultre" className="text-neutral-900">Jaeger-LeCoultre</option>
                  <option value="IWC Schaffhausen" className="text-neutral-900">IWC Schaffhausen</option>
                  <option value="Panerai" className="text-neutral-900">Panerai</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth disabled:opacity-50 shadow-lg shadow-gold-500/20 active:scale-95"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
