"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { cardAPI } from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";
import { Check, CreditCard, DollarSign, Shield, ChevronRight, ChevronLeft } from "lucide-react";

const CARD_TIERS = [
  {
    tier: "Gold",
    limit: 50000,
    cashback: 2,
    fee: 0,
    perks: [
      "2% cashback on all purchases",
      "Global acceptance",
      "Travel insurance",
      "Purchase protection",
    ],
  },
  {
    tier: "Platinum",
    limit: 250000,
    cashback: 4,
    fee: 95,
    perks: [
      "4% cashback on all purchases",
      "Priority lounge access",
      "24/7 concierge service",
      "Extended warranty",
      "Travel insurance",
    ],
  },
  {
    tier: "Black",
    limit: 0,
    cashback: 8,
    fee: 495,
    perks: [
      "8% cashback on luxury brands",
      "Private jet access",
      "Personal wealth manager",
      "Exclusive event invitations",
      "Global concierge",
      "No preset spending limit",
    ],
  },
];

export default function ApplyCardPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [step, setStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState("Platinum");
  const [formData, setFormData] = useState({
    employment_status: "",
    employer: "",
    annual_income: "",
    housing_status: "",
    monthly_rent: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [approved, setApproved] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);

    // Simulate approval process
    setTimeout(async () => {
      try {
        const selectedCard = CARD_TIERS.find(c => c.tier === selectedTier);
        const response = await cardAPI.applyCard({
          card_type: selectedTier,
          card_brand: "Cartier",
          credit_limit: selectedCard?.limit || 50000,
        });
        if (response.data) {
          setApproved(true);
        } else {
          showNotification("Application failed. Please try again.", "error");
        }
      } catch (error) {
        showNotification("Application failed. Please try again.", "error");
      } finally {
        setSubmitting(false);
      }
    }, 2000);
  };

  if (approved) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-green-500" size={40} />
            </div>
            <h1 className="text-4xl font-work-sans font-bold mb-4 text-neutral-900">Congratulations!</h1>
            <p className="text-xl text-neutral-700 mb-8 font-gruppo">
              Your {selectedTier} Card application has been approved
            </p>
            <div className="glass border border-gold-500/20 rounded-xl p-8 mb-8 shadow-lg">
              <p className="text-neutral-700 mb-4 font-gruppo">
                Your new {selectedTier} Card is being prepared and will arrive within 5-7 business days.
                You&apos;ll receive a confirmation email shortly with tracking information.
              </p>
              <p className="text-sm text-neutral-600 font-gruppo">
                Your card will be activated automatically upon first use.
              </p>
            </div>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => router.push("/dashboard/cards")}
                className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth shadow-lg shadow-gold-500/20 active:scale-95"
              >
                View My Cards
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-8 py-3 glass text-neutral-700 rounded-lg font-work-sans font-semibold hover:glass-gold transition-smooth shadow-md active:scale-95"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-work-sans font-bold mb-2 text-neutral-900">Apply for Concierge Bank Card</h1>
            <p className="text-neutral-600 font-gruppo">Complete your application in 3 simple steps</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-work-sans font-semibold transition-colors ${
                    step >= s
                      ? "bg-gradient-to-r from-gold-600 to-gold-700 text-white shadow-md"
                      : "glass text-neutral-700 border border-gold-500/30"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > s ? "bg-gradient-to-r from-gold-600 to-gold-700" : "bg-neutral-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Choose Card */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-work-sans font-semibold text-neutral-900">Choose Your Card</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {CARD_TIERS.map((card) => (
                    <div
                      key={card.tier}
                      onClick={() => setSelectedTier(card.tier)}
                      className={`p-6 rounded-xl cursor-pointer transition-all ${
                        selectedTier === card.tier
                          ? "glass-gold border-2 border-gold-600 shadow-lg"
                          : "glass border border-gold-500/30 hover:border-gold-500/60 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-work-sans font-bold">{card.tier}</h3>
                        {selectedTier === card.tier && (
                          <Check className="text-gold-500" size={24} />
                        )}
                      </div>
                      <p className="text-3xl font-work-sans font-bold mb-2 text-neutral-900">{card.cashback}%</p>
                      <p className="text-sm text-neutral-600 mb-4 font-gruppo">Cashback</p>
                      <p className="text-sm text-neutral-600 mb-4 font-gruppo">
                        {card.limit === 0
                          ? "No preset limit"
                          : `$${card.limit.toLocaleString()} limit`}
                      </p>
                      <div className="space-y-2 mb-4">
                        {card.perks.map((perk, i) => (
                          <p key={i} className="text-xs text-neutral-600 flex items-start">
                            <span className="text-gold-500 mr-2">•</span>
                            {perk}
                          </p>
                        ))}
                      </div>
                      <p className="text-sm font-work-sans font-semibold text-neutral-700">
                        {card.fee === 0 ? "No annual fee" : `$${card.fee}/year`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Employment Info */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-work-sans font-semibold text-neutral-900">Employment Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-work-sans font-medium mb-2 text-neutral-900">Employment Status</label>
                    <select
                      value={formData.employment_status}
                      onChange={(e) =>
                        setFormData({ ...formData, employment_status: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 shadow-inner"
                    >
                      <option value="" className="text-neutral-400">Select status</option>
                      <option value="employed" className="text-neutral-900">Employed</option>
                      <option value="self-employed" className="text-neutral-900">Self-Employed</option>
                      <option value="retired" className="text-neutral-900">Retired</option>
                      <option value="other" className="text-neutral-900">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-work-sans font-medium mb-2 text-neutral-900">Employer</label>
                    <input
                      type="text"
                      value={formData.employer}
                      onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                      required
                      placeholder="Company name"
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-work-sans font-medium mb-2 text-neutral-900">Annual Income</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                      <input
                        type="number"
                        value={formData.annual_income}
                        onChange={(e) =>
                          setFormData({ ...formData, annual_income: e.target.value })
                        }
                        required
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-work-sans font-medium mb-2 text-neutral-900">Housing Status</label>
                    <select
                      value={formData.housing_status}
                      onChange={(e) =>
                        setFormData({ ...formData, housing_status: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 shadow-inner"
                    >
                      <option value="" className="text-neutral-400">Select status</option>
                      <option value="own" className="text-neutral-900">Own</option>
                      <option value="rent" className="text-neutral-900">Rent</option>
                      <option value="other" className="text-neutral-900">Other</option>
                    </select>
                  </div>

                  {formData.housing_status === "rent" && (
                    <div>
                      <label className="block text-sm font-work-sans font-medium mb-2 text-neutral-900">Monthly Rent/Mortgage</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                        <input
                          type="number"
                          value={formData.monthly_rent}
                          onChange={(e) =>
                            setFormData({ ...formData, monthly_rent: e.target.value })
                          }
                          placeholder="0"
                          className="w-full pl-10 pr-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 shadow-inner"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-work-sans font-semibold text-neutral-900">Review Your Application</h2>
                <div className="glass border border-gold-500/20 rounded-xl p-6 space-y-4 shadow-lg">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 font-gruppo">Card Type</span>
                    <span className="font-work-sans font-semibold text-neutral-900">{selectedTier} Card</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 font-gruppo">Employment</span>
                    <span className="font-work-sans font-semibold text-neutral-900">{formData.employment_status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 font-gruppo">Employer</span>
                    <span className="font-work-sans font-semibold text-neutral-900">{formData.employer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 font-gruppo">Annual Income</span>
                    <span className="font-work-sans font-semibold text-neutral-900">${parseInt(formData.annual_income).toLocaleString()}</span>
                  </div>
                </div>

                <div className="glass-gold border border-gold-500/30 rounded-xl p-6 shadow-md">
                  <Shield className="text-gold-500 mb-3" size={32} />
                  <h3 className="font-work-sans font-semibold mb-2 text-neutral-900">Instant Decision</h3>
                  <p className="text-sm text-neutral-700 font-gruppo">
                    We&apos;ll process your application immediately and provide an instant decision. Your information is encrypted and secure.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center space-x-2 px-6 py-3 glass text-neutral-700 rounded-lg font-work-sans font-semibold hover:glass-gold transition-smooth shadow-md active:scale-95"
                >
                  <ChevronLeft size={20} />
                  <span>Back</span>
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className={`flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-bold hover:from-gold-500 hover:to-gold-600 transition-smooth disabled:opacity-50 shadow-lg shadow-gold-500/20 active:scale-95 ${
                  step === 1 ? "ml-auto" : ""
                }`}
              >
                <span>{submitting ? "Processing..." : step === 3 ? "Submit Application" : "Continue"}</span>
                {!submitting && <ChevronRight size={20} />}
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
