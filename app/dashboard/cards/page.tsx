"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import CreditCard from "@/components/CreditCard";
import { cardAPI, Card } from "@/lib/api";
import { CreditCard as CreditCardIcon, Lock, Unlock, AlertCircle, Plus } from "lucide-react";

export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

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
        alert(`Card ${newStatus === "locked" ? "locked" : "unlocked"} successfully`);
      }
    } catch (error) {
      alert("Failed to update card status");
    }
  };

  const getCardColor = (brand: string) => {
    const colors: { [key: string]: string } = {
      Cartier: "from-red-600 to-red-800",
      "Van Cleef & Arpels": "from-blue-600 to-blue-800",
      Montblanc: "from-gray-700 to-gray-900",
      "Jaeger-LeCoultre": "from-purple-600 to-purple-800",
      default: "from-gold-500 to-gold-700",
    };
    return colors[brand] || colors.default;
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
              className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-semibold hover:from-gold-500 hover:to-gold-600 transition-colors flex-shrink-0 text-sm sm:text-base active:scale-95 shadow-md"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Request Card</span>
              <span className="sm:hidden">Request</span>
            </button>
          </div>

          {cards.length === 0 ? (
            <div className="p-12 bg-white/50 backdrop-blur-sm border border-gold-200/60 rounded-xl text-center shadow-sm">
              <CreditCardIcon className="w-16 h-16 text-gold-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Your Collection Awaits</h3>
              <p className="text-neutral-600 mb-6">
                Discover payment instruments crafted with the precision of Richemont&apos;s Maisons. Each card, a masterpiece of privilege.
              </p>
              <button
                onClick={() => router.push("/dashboard/cards/apply")}
                className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-semibold hover:from-gold-500 hover:to-gold-600 transition-colors shadow-md"
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
                    holder="Cardholder Name"
                    expiryDate={card.expiry_date}
                    cvv={card.cvv}
                    tier={card.tier}
                    brand={card.card_brand}
                    balance={card.balance}
                    creditLimit={card.credit_limit}
                    status={card.status}
                  />

                  {/* Card Actions */}
                  <div className="bg-white/50 backdrop-blur-sm border border-gold-200/60 rounded-xl p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleCardLock(card.id, card.status)}
                        className="flex items-center space-x-2 text-sm text-gold-700 hover:text-gold-600 font-medium transition-colors"
                      >
                        {card.status === "locked" ? <Unlock size={16} /> : <Lock size={16} />}
                        <span>{card.status === "locked" ? "Activate" : "Secure"}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => alert("Report lost/stolen functionality")}
                      className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-red-600 hover:text-red-500 font-medium transition-colors"
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
            <div className="bg-white/50 backdrop-blur-sm border border-gold-200/60 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mb-4">
                <CreditCardIcon className="text-gold-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900">Maison Privileges</h3>
              <p className="text-sm text-neutral-600">
                Earn up to 8% returns on acquisitions at Cartier, Van Cleef & Arpels, Jaeger-LeCoultre, and our sister Maisons
              </p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm border border-gold-200/60 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mb-4">
                <Lock className="text-gold-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900">Swiss Vault Security</h3>
              <p className="text-sm text-neutral-600">
                Geneva-grade protection with instant controls, real-time intelligence, and zero-liability guarantee
              </p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm border border-gold-200/60 rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle className="text-gold-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900">Private Concierge</h3>
              <p className="text-sm text-neutral-600">
                Your dedicated attaché for acquisitions, reservations, and experiences befitting Richemont clientele
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
