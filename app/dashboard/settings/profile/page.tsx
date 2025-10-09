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
    
    setTimeout(() => {
      alert("Profile updated successfully!");
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
              <h1 className="text-3xl font-serif font-bold">Profile Settings</h1>
              <p className="text-gray-400">Update your personal information</p>
            </div>
          </div>

          <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-8 space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gold-500/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold">{user?.full_name?.charAt(0) || "U"}</span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center hover:bg-gold-400">
                  <Camera size={16} className="text-dark-900" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold mb-1">{user?.full_name}</h3>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Richemont Brand</label>
                <select
                  value={formData.preferred_brand}
                  onChange={(e) => setFormData({ ...formData, preferred_brand: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500"
                >
                  <option value="Cartier">Cartier</option>
                  <option value="Van Cleef & Arpels">Van Cleef & Arpels</option>
                  <option value="Montblanc">Montblanc</option>
                  <option value="Jaeger-LeCoultre">Jaeger-LeCoultre</option>
                  <option value="IWC Schaffhausen">IWC Schaffhausen</option>
                  <option value="Panerai">Panerai</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400 transition-colors disabled:opacity-50"
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
