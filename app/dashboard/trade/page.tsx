"use client";

/**
 * Immersive trading desk. Bypasses DashboardLayout so the chart gets the
 * full viewport — like TradingView launched from the bank app.
 *
 * A slim, frosted top-bar keeps brand identity + gives the user a fast way
 * back to the dashboard. Everything else is the TradingApp itself.
 */

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy-load the heavy trading UI (recharts + framer-motion) client-side only.
const TradingApp = dynamic(() => import("./_module/TradingApp"), {
	ssr: false,
	loading: () => (
		<div className="fixed inset-0 flex items-center justify-center bg-[#131722] text-[#d1d4dc]">
			<div className="flex items-center gap-3 text-sm">
				<div className="w-5 h-5 border-2 border-[#2962ff] border-t-transparent rounded-full animate-spin" />
				Loading trading desk…
			</div>
		</div>
	),
});

export default function TradePage() {
	return (
		<ProtectedRoute>
			{/* TradingApp sizes itself to the full viewport (h-screen/w-screen). */}
			<TradingApp />

			{/* Floating "Exit to dashboard" chip — sits above TradingApp's own top
			    chrome without competing with it. Frosted so the chart shows through. */}
			<Link
				href="/dashboard"
				className="fixed top-2 left-2 z-[150] flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#1e222d]/85 hover:bg-[#2a2e39]/95 border border-[#363a45] backdrop-blur text-[11px] font-semibold text-[#d1d4dc] hover:text-white transition-colors shadow-lg"
				title="Back to dashboard"
			>
				<ArrowLeft size={12} />
				<span className="hidden sm:inline">Dashboard</span>
			</Link>
		</ProtectedRoute>
	);
}
