"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { beneficiariesAPI, Beneficiary } from "@/lib/api";
import { Users, Plus, Trash2, ArrowLeft, Mail, Phone } from "lucide-react";

export default function BeneficiariesPage() {
  const router = useRouter();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    relationship: "",
    email: "",
    phone: "",
    percentage: "",
  });

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      const response = await beneficiariesAPI.getBeneficiaries();
      if (response.data) {
        setBeneficiaries(response.data);
      }
    } catch (error) {
      console.error("Failed to load beneficiaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await beneficiariesAPI.addBeneficiary({
        full_name: formData.full_name,
        relationship: formData.relationship,
        email: formData.email,
        phone: formData.phone,
        percentage: parseFloat(formData.percentage),
      });

      if (response.data) {
        setBeneficiaries([...beneficiaries, response.data]);
        setShowAddModal(false);
        setFormData({
          full_name: "",
          relationship: "",
          email: "",
          phone: "",
          percentage: "",
        });
        alert("Beneficiary added successfully!");
      } else if (response.error) {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      alert("Failed to add beneficiary");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this beneficiary?")) return;

    try {
      const response = await beneficiariesAPI.deleteBeneficiary(id);
      if (response.data || !response.error) {
        setBeneficiaries(beneficiaries.filter((b) => b.id !== id));
        alert("Beneficiary removed successfully");
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      alert("Failed to remove beneficiary");
    }
  };

  const totalPercentage = beneficiaries.reduce((sum, b) => sum + (b.percentage || 0), 0);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8 pb-8">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-dark-700 rounded-lg transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-serif font-bold">Beneficiaries</h1>
              <p className="text-gray-300">Manage your account beneficiaries</p>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-gold-500/10 to-gold-600/10 border border-gold-500/30 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center">
                  <Users className="text-gold-500" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Estate Planning</h3>
                  <p className="text-sm text-gray-300">
                    Designate beneficiaries for your accounts. Total allocation: {totalPercentage}%
                  </p>
                  {totalPercentage !== 100 && beneficiaries.length > 0 && (
                    <p className="text-xs text-yellow-400 mt-2">
                      ⚠️ Allocation should total 100% for complete coverage
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400 transition-colors"
              >
                <Plus size={18} />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Beneficiaries List */}
          {beneficiaries.length === 0 ? (
            <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-gold-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">No beneficiaries yet</h3>
              <p className="text-gray-300 mb-6">
                Add beneficiaries to ensure your assets are distributed according to your wishes
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400 transition-colors"
              >
                Add Your First Beneficiary
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {beneficiaries.map((beneficiary) => (
                <div
                  key={beneficiary.id}
                  className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-6 hover:border-gold-500/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{beneficiary.full_name}</h3>
                        <span className="px-3 py-1 bg-gold-500/20 text-gold-500 text-xs font-medium rounded-full">
                          {beneficiary.percentage}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{beneficiary.relationship}</p>
                      <div className="space-y-1">
                        {beneficiary.email && (
                          <div className="flex items-center space-x-2 text-sm text-gray-300">
                            <Mail size={14} className="text-gray-400" />
                            <span>{beneficiary.email}</span>
                          </div>
                        )}
                        {beneficiary.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-300">
                            <Phone size={14} className="text-gray-400" />
                            <span>{beneficiary.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(beneficiary.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      aria-label="Remove beneficiary"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Beneficiary Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="w-full max-w-md bg-dark-800 border border-gold-500/30 rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Add Beneficiary</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Relationship</label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 text-white"
                  >
                    <option value="" className="text-gray-400">Select relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other Family">Other Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Trust">Trust</option>
                    <option value="Charity">Charity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="beneficiary@example.com"
                    className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 text-white placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Allocation Percentage</label>
                  <input
                    type="number"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="25.00"
                    className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 text-white placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Current total: {totalPercentage}% | Remaining: {100 - totalPercentage}%
                  </p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 bg-dark-700 text-gray-200 rounded-lg font-semibold hover:bg-dark-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400 transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Adding..." : "Add Beneficiary"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
