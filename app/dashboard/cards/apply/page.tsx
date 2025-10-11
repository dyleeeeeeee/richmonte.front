"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { cardAPI } from "@/lib/api";
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
          alert("Application failed. Please try again.");
        }
      } catch (error) {
        alert("Application failed. Please try again.");
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
            <h1 className="text-4xl font-work-sans font-bold mb-4">Congratulations!</h1>
            <p className="text-xl text-gray-300 mb-8 font-gruppo">
              Your {selectedTier} Card application has been approved
            </p>
            <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-8 mb-8">
              <p className="text-gray-400 mb-4 font-gruppo">
                Your new {selectedTier} Card is being prepared and will arrive within 5-7 business days.
                You&apos;ll receive a confirmation email shortly with tracking information.
              </p>
              <p className="text-sm text-gray-500 font-gruppo">
                Your card will be activated automatically upon first use.
              </p>
            </div>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => router.push("/dashboard/cards")}
                className="px-8 py-3 bg-gold-500 text-dark-900 rounded-lg font-work-sans font-semibold hover:bg-gold-400 transition-colors"
              >
                View My Cards
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-8 py-3 bg-dark-700 text-gray-300 rounded-lg font-work-sans font-semibold hover:bg-dark-600 transition-colors"
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
            <h1 className="text-3xl font-work-sans font-bold mb-2">Apply for Concierge Bank Card</h1>
            <p className="text-gray-400 font-gruppo">Complete your application in 3 simple steps</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-work-sans font-semibold transition-colors ${
                    step >= s
                      ? "bg-gold-500 text-dark-900"
                      : "bg-dark-800 text-gray-400 border border-gold-500/20"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > s ? "bg-gold-500" : "bg-dark-800"
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
                <h2 className="text-2xl font-work-sans font-semibold">Choose Your Card</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {CARD_TIERS.map((card) => (
                    <div
                      key={card.tier}
                      onClick={() => setSelectedTier(card.tier)}
                      className={`p-6 rounded-xl cursor-pointer transition-all ${
                        selectedTier === card.tier
                          ? "bg-gold-500/20 border-2 border-gold-500"
                          : "bg-dark-800/30 border border-gold-500/10 hover:border-gold-500/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-work-sans font-bold">{card.tier}</h3>
                        {selectedTier === card.tier && (
                          <Check className="text-gold-500" size={24} />
                        )}
                      </div>
                      <p className="text-3xl font-work-sans font-bold mb-2">{card.cashback}%</p>
                      <p className="text-sm text-gray-400 mb-4 font-gruppo">Cashback</p>
                      <p className="text-sm text-gray-400 mb-4 font-gruppo">
                        {card.limit === 0
                          ? "No preset limit"
                          : `$${card.limit.toLocaleString()} limit`}
                      </p>
                      <div className="space-y-2 mb-4">
                        {card.perks.map((perk, i) => (
                          <p key={i} className="text-xs text-gray-400 flex items-start">
                            <span className="text-gold-500 mr-2">•</span>
                            {perk}
                          </p>
                        ))}
                      </div>
                      <p className="text-sm font-work-sans font-semibold">
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
                <h2 className="text-2xl font-work-sans font-semibold">Employment Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-work-sans font-medium mb-2">Employment Status</label>
                    <select
                      value={formData.employment_status}
                      onChange={(e) =>
                        setFormData({ ...formData, employment_status: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500"
                    >
                      <option value="">Select status</option>
                      <option value="employed">Employed</option>
                      <option value="self-employed">Self-Employed</option>
                      <option value="retired">Retired</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-work-sans font-medium mb-2">Employer</label>
                    <input
                      type="text"
                      value={formData.employer}
                      onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                      required
                      placeholder="Company name"
                      className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-work-sans font-medium mb-2">Annual Income</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        value={formData.annual_income}
                        onChange={(e) =>
                          setFormData({ ...formData, annual_income: e.target.value })
                        }
                        required
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-work-sans font-medium mb-2">Housing Status</label>
                    <select
                      value={formData.housing_status}
                      onChange={(e) =>
                        setFormData({ ...formData, housing_status: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500"
                    >
                      <option value="">Select status</option>
                      <option value="own">Own</option>
                      <option value="rent">Rent</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {formData.housing_status === "rent" && (
                    <div>
                      <label className="block text-sm font-work-sans font-medium mb-2">Monthly Rent/Mortgage</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          value={formData.monthly_rent}
                          onChange={(e) =>
                            setFormData({ ...formData, monthly_rent: e.target.value })
                          }
                          placeholder="0"
                          className="w-full pl-10 pr-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500"
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
                <h2 className="text-2xl font-work-sans font-semibold">Review Your Application</h2>
                <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Card Type</span>
                    <span className="font-work-sans font-semibold">{selectedTier} Card</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Employment</span>
                    <span className="font-work-sans font-semibold">{formData.employment_status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Employer</span>
                    <span className="font-work-sans font-semibold">{formData.employer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Annual Income</span>
                    <span className="font-work-sans font-semibold">${parseInt(formData.annual_income).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-6">
                  <Shield className="text-gold-500 mb-3" size={32} />
                  <h3 className="font-work-sans font-semibold mb-2">Instant Decision</h3>
                  <p className="text-sm text-gray-300 font-gruppo">
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
                  className="flex items-center space-x-2 px-6 py-3 bg-dark-700 text-gray-300 rounded-lg font-work-sans font-semibold hover:bg-dark-600 transition-colors"
                >
                  <ChevronLeft size={20} />
                  <span>Back</span>
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className={`flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 rounded-lg font-work-sans font-bold hover:from-gold-400 hover:to-gold-500 transition-all disabled:opacity-50 ${
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
