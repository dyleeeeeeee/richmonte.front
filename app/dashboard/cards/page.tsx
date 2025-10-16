"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import CreditCard from "@/components/CreditCard";
import { cardAPI, Card } from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard as CreditCardIcon, Lock, Unlock, AlertCircle, Plus } from "lucide-react";

export default function CardsPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [selectedCardForReport, setSelectedCardForReport] = useState<string>('');
  const [reportForm, setReportForm] = useState({
    issue_type: 'lost' as 'lost' | 'stolen' | 'damaged' | 'other',
    description: '',
  });

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const response = await cardAPI.getCards();
      if (response.data) {
        setCards(response.data);
      }
    } catch (error) {
      console.error("Failed to load cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCardLock = async (cardId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "locked" : "active";
    try {
      const response = await cardAPI.lockCard(cardId, newStatus === "locked");
      if (response.data) {
        setCards(cards.map((c) => (c.id === cardId ? { ...c, status: newStatus } : c)));
        showNotification(`Card ${newStatus === "locked" ? "locked" : "unlocked"} successfully`, "success");
      }
    } catch (error) {
      showNotification("Failed to update card status", "error");
    }
  };

  const reportCardIssue = async (cardId: string) => {
    try {
      const response = await cardAPI.reportCardIssue(cardId, reportForm);
      if (response.data) {
        setCards(cards.map((c) => (c.id === cardId ? { ...c, status: "reported" } : c)));
        showNotification("Card issue reported successfully. Investigation will begin shortly.", "success");
        setShowReportIssueModal(false);
        setReportForm({
          issue_type: 'lost',
          description: '',
        });
        setSelectedCardForReport('');
      }
    } catch (error) {
      showNotification("Failed to report card issue", "error");
    }
  };

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
        <div className="space-y-6 sm:space-y-8 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-1 sm:mb-2">Your Cards</h1>
              <p className="text-sm sm:text-base text-neutral-600">Maison Richemont&apos;s legacy of excellence</p>
            </div>
            <button
              onClick={() => router.push("/dashboard/cards/apply")}
              className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth flex-shrink-0 text-sm sm:text-base active:scale-95 shadow-lg shadow-gold-500/20 hover-glow"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Request Card</span>
              <span className="sm:hidden">Request</span>
            </button>
          </div>

          {cards.length === 0 ? (
            <div className="p-12 glass rounded-xl text-center shadow-lg animate-scale-in">
              <CreditCardIcon className="w-16 h-16 text-gold-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Your Collection Awaits</h3>
              <p className="text-neutral-600 mb-6">
                Discover payment instruments crafted with the precision of Richemont&apos;s Maisons. Each card, a masterpiece of privilege.
              </p>
              <button
                onClick={() => router.push("/dashboard/cards/apply")}
                className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth shadow-lg shadow-gold-500/20 hover-glow active:scale-95"
              >
                Request Your Card
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cards.map((card) => (
                <div key={card.id} className="space-y-4">
                  {/* 3D Flip Credit Card */}
                  <CreditCard
                    cardNumber={card.card_number}
                    holder={user?.full_name || "Cardholder"}
                    expiryDate={card.expiry_date}
                    cvv={card.cvv}
                    tier={card.card_type}
                    brand={card.card_brand}
                    balance={card.balance}
                    creditLimit={card.credit_limit}
                    status={card.status}
                  />

                  {/* Card Actions */}
                  <div className="glass rounded-xl p-4 shadow-md space-y-3 hover-lift">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleCardLock(card.id, card.status)}
                        className="flex items-center space-x-2 text-sm text-gold-700 hover:text-gold-600 font-medium transition-smooth active:scale-95"
                      >
                        {card.status === "locked" ? <Unlock size={16} /> : <Lock size={16} />}
                        <span>{card.status === "locked" ? "Activate" : "Secure"}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCardForReport(card.id);
                        setShowReportIssueModal(true);
                      }}
                      className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-red-600 hover:text-red-500 font-medium transition-smooth active:scale-95"
                    >
                      <AlertCircle size={16} />
                      <span>Report Issue</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Card Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="glass rounded-xl p-6 shadow-lg hover-lift transition-smooth">
              <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mb-4">
                <CreditCardIcon className="text-gold-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900">Maison Privileges</h3>
              <p className="text-sm text-neutral-600">
                Earn up to 8% returns on acquisitions at Cartier, Van Cleef & Arpels, Jaeger-LeCoultre, and our sister Maisons
              </p>
            </div>

            <div className="glass rounded-xl p-6 shadow-lg hover-lift transition-smooth">
              <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mb-4">
                <Lock className="text-gold-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900">Swiss Vault Security</h3>
              <p className="text-sm text-neutral-600">
                Geneva-grade protection with instant controls, real-time intelligence, and zero-liability guarantee
              </p>
            </div>

            <div className="glass rounded-xl p-6 shadow-lg hover-lift transition-smooth">
              <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle className="text-gold-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900">Private Concierge</h3>
              <p className="text-sm text-neutral-600">
                Your dedicated attaché for acquisitions, reservations, and experiences befitting Richemont clientele
              </p>
            </div>
          </div>

          {/* Report Issue Modal */}
          {showReportIssueModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-md glass-gold border border-gold-500/30 rounded-2xl p-8 shadow-2xl animate-scale-in">
                <h2 className="text-2xl font-work-sans font-bold mb-6 text-neutral-900">Report Card Issue</h2>
                <p className="text-neutral-600 mb-6 text-sm">
                  Report lost, stolen, or damaged cards immediately. Your card will be temporarily suspended for investigation.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    reportCardIssue(selectedCardForReport);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-900">Issue Type</label>
                    <select
                      value={reportForm.issue_type}
                      onChange={(e) => setReportForm({ ...reportForm, issue_type: e.target.value as any })}
                      required
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900"
                    >
                      <option value="lost">Card Lost</option>
                      <option value="stolen">Card Stolen</option>
                      <option value="damaged">Card Damaged</option>
                      <option value="other">Other Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-900">Description (Optional)</label>
                    <textarea
                      value={reportForm.description}
                      onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                      placeholder="Provide additional details about the issue..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 resize-none"
                    />
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-orange-800">
                        <p className="font-medium">Important:</p>
                        <p>Your card will be temporarily blocked during investigation. A replacement will be issued within 3-5 business days.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReportIssueModal(false);
                        setSelectedCardForReport('');
                        setReportForm({
                          issue_type: 'lost',
                          description: '',
                        });
                      }}
                      className="flex-1 px-6 py-3 glass text-neutral-700 rounded-lg font-work-sans font-semibold hover:glass-gold transition-smooth"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-work-sans font-semibold hover:from-red-500 hover:to-red-600 transition-smooth"
                    >
                      Report Issue
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
