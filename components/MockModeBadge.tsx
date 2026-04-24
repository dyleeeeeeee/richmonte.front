"use client";

/**
 * Tiny floating badge that shows when mock mode is active.
 * Click to open a popover with toggle + reset controls.
 *
 * Renders nothing in production (NODE_ENV=production && not in mock mode).
 */

import { useEffect, useState } from "react";
import { isMockModeEnabled, resetMockDb } from "@/lib/mockApi";

export default function MockModeBadge() {
	const [active, setActive] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setActive(isMockModeEnabled());
	}, []);

	// Hide in production builds when mock is off — zero visual noise for users.
	if (!active && process.env.NODE_ENV === "production") return null;

	const enable = () => {
		localStorage.setItem("invbank_mock", "1");
		location.reload();
	};
	const disable = () => {
		localStorage.removeItem("invbank_mock");
		location.reload();
	};
	const wipe = () => {
		resetMockDb();
		location.reload();
	};

	return (
		<div className="fixed bottom-4 right-4 z-[200] font-work-sans">
			{open && (
				<div className="mb-2 w-64 rounded-lg bg-white border border-light-300 shadow-xl p-3 text-xs text-neutral-700">
					<div className="font-bold text-navy-900 text-sm mb-2">
						Mock mode {active ? "ON" : "OFF"}
					</div>
					<p className="leading-relaxed mb-3 font-gruppo text-neutral-600">
						{active
							? "The UI is talking to an in-browser fake backend. All data is stored in localStorage."
							: "Hitting the real backend. Enable mock to test without a server."}
					</p>
					{active ? (
						<>
							<div className="text-[11px] bg-light-100 rounded p-2 mb-2 leading-relaxed">
								<div><b>demo@invbank.us</b> / password123</div>
								<div><b>admin@invbank.us</b> / admin123</div>
							</div>
							<div className="flex gap-1.5">
								<button onClick={wipe} className="flex-1 px-2 py-1.5 text-[11px] font-bold bg-light-200 hover:bg-light-300 rounded">Reset DB</button>
								<button onClick={disable} className="flex-1 px-2 py-1.5 text-[11px] font-bold bg-navy-900 hover:bg-navy-800 text-white rounded">Disable</button>
							</div>
						</>
					) : (
						<button onClick={enable} className="w-full px-2 py-1.5 text-[11px] font-bold bg-navy-900 hover:bg-navy-800 text-white rounded">
							Enable mock mode
						</button>
					)}
				</div>
			)}
			<button
				onClick={() => setOpen((o) => !o)}
				className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-lg transition-all ${
					active
						? "bg-amber-400 text-amber-950 hover:bg-amber-300"
						: "bg-navy-900 text-white hover:bg-navy-800"
				}`}
				title="Mock-mode controls"
			>
				<span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-amber-950 animate-pulse" : "bg-white/60"}`} />
				{active ? "Mock mode" : "Live mode"}
			</button>
		</div>
	);
}
