"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await login(email, password);
			router.push("/dashboard");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthShell
			title="Welcome back"
			subtitle="Sign in to access your accounts, cards and trading desk."
			footer={
				<>
					By signing in, you agree to our{" "}
					<Link href="/terms" className="text-navy-700 hover:underline">Terms of Service</Link>
					{" "}and{" "}
					<Link href="/privacy" className="text-navy-700 hover:underline">Privacy Policy</Link>.
				</>
			}
		>
			<form onSubmit={handleSubmit} className="space-y-5">
				{error && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-xs font-gruppo">
						{error}
					</div>
				)}

				<div>
					<label htmlFor="email" className="block text-[11px] font-work-sans font-bold mb-1.5 text-navy-900 uppercase tracking-wider">
						Email Address
					</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						autoComplete="email"
						className="w-full px-4 py-3 bg-white border border-light-300 rounded-lg focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-700/15 transition-all text-neutral-900 text-sm"
						placeholder="you@example.com"
					/>
				</div>

				<div>
					<div className="flex items-center justify-between mb-1.5">
						<label htmlFor="password" className="block text-[11px] font-work-sans font-bold text-navy-900 uppercase tracking-wider">
							Password
						</label>
						<Link href="/forgot-password" className="text-[11px] text-navy-700 hover:text-navy-900 transition-colors font-gruppo">
							Forgot?
						</Link>
					</div>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						autoComplete="current-password"
						className="w-full px-4 py-3 bg-white border border-light-300 rounded-lg focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-700/15 transition-all text-neutral-900 text-sm"
						placeholder="••••••••"
					/>
				</div>

				<label className="flex items-center gap-2 text-xs text-neutral-600 font-gruppo cursor-pointer select-none">
					<input
						type="checkbox"
						className="w-4 h-4 accent-navy-700 border-light-300 rounded"
					/>
					<span>Remember me on this device</span>
				</label>

				<button
					type="submit"
					disabled={loading}
					className="w-full px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white rounded-lg font-work-sans font-bold text-sm tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-navy-950/20"
				>
					{loading ? "Signing in…" : "Sign In"}
				</button>
			</form>

			<div className="mt-6 pt-5 border-t border-light-300 text-center text-sm text-neutral-600 font-gruppo">
				New to InvBank?{" "}
				<Link href="/register" className="text-navy-700 hover:text-navy-900 font-work-sans font-bold">
					Open an account
				</Link>
			</div>
		</AuthShell>
	);
}
