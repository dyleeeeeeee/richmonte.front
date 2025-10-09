"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { accountAPI } from "@/lib/api";
import { Receipt, Plus, Calendar, Check } from "lucide-react";

export default function BillsPage() {
  const [loading, setLoading] = useState(true);
  const [bills] = useState([
    { id: "1", payee_name: "Electric", amount: 150, due_date: "2025-11-01", auto_pay: true },
    { id: "2", payee_name: "Internet", amount: 90, due_date: "2025-11-05", auto_pay: false },
  ]);

  useEffect(() => {
    setLoading(false);
  }, []);

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
              <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-1 sm:mb-2">Bill Pay</h1>
              <p className="text-sm sm:text-base text-gray-400">Manage and pay your bills</p>
            </div>
            <button className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400 flex-shrink-0 text-sm sm:text-base active:scale-95">
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Add Bill</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bills.map((bill) => (
              <div key={bill.id} className="bg-dark-800/30 border border-gold-500/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">{bill.payee_name}</h3>
                <p className="text-2xl font-bold mb-4">${bill.amount}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
                  <Calendar size={16} />
                  <span>Due: {new Date(bill.due_date).toLocaleDateString()}</span>
                </div>
                <button className="w-full px-4 py-2 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400">
                  Pay Now
                </button>
                <p className="text-xs text-center text-gray-400 mt-2">
                  {bill.auto_pay ? "Auto-pay enabled" : "Manual payment"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
