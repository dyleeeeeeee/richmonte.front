"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { FileText, Download, Mail, Calendar } from "lucide-react";

export default function StatementsPage() {
  const [statements] = useState([
    { id: "1", month: "October 2025", date: "2025-10-31", size: "245 KB" },
    { id: "2", month: "September 2025", date: "2025-09-30", size: "238 KB" },
    { id: "3", month: "August 2025", date: "2025-08-31", size: "251 KB" },
  ]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 sm:space-y-8 pb-4">
          <div className="px-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-1 sm:mb-2">Statements</h1>
            <p className="text-sm sm:text-base text-gray-400">View and download your account statements</p>
          </div>

          <div className="bg-dark-800/30 border border-gold-500/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-800/50 border-b border-gold-500/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Statement Period</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Size</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-500/10">
                  {statements.map((statement) => (
                    <tr key={statement.id} className="hover:bg-dark-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <FileText className="text-gold-500" size={20} />
                          <span className="font-medium">{statement.month}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{statement.date}</td>
                      <td className="px-6 py-4 text-gray-400">{statement.size}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors" title="Download">
                            <Download className="text-gold-500" size={18} />
                          </button>
                          <button className="p-2 hover:bg-dark-700 rounded-lg transition-colors" title="Email">
                            <Mail className="text-gold-500" size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-6">
            <Calendar className="text-gold-500 mb-3" size={32} />
            <h3 className="font-semibold mb-2">Go Paperless</h3>
            <p className="text-sm text-gray-300 mb-4">
              Switch to e-statements and help the environment. You&apos;ll receive email notifications when new statements are available.
            </p>
            <button className="px-6 py-2 bg-gold-500 text-dark-900 rounded-lg font-semibold hover:bg-gold-400">
              Enable E-Statements
            </button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
