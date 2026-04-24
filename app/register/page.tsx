"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { useAuth } from "@/contexts/AuthContext";
import type { RegisterData } from "@/lib/api";

/**
 * Primary account-type selector maps to the `preferred_brand` backend field.
 * The backend already stores this as an opaque string; we just change the label
 * set (no schema change needed on the backend).
 */
const ACCOUNT_TYPES = [
	{ value: "Everyday", label: "Everyday Checking — zero monthly fees" },
	{ value: "Savings", label: "High-Yield Savings — 4.50% APY" },
	{ value: "Business", label: "Business Checking — for sole props & LLCs" },
	{ value: "Invest", label: "Invest & Trade — commission-free" },
	{ value: "Wealth", label: "Wealth Management — advisor-guided" },
];

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		full_name: "",
		phone: "",
		preferred_brand: "Everyday",
		transaction_pin: "",
		website: "",
	});
	const [formLoadTime] = useState(Date.now() / 1000);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { register } = useAuth();
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		if (formData.password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}
		if (!formData.transaction_pin || !/^\d{6}$/.test(formData.transaction_pin)) {
			setError("Transaction PIN must be exactly 6 digits");
			return;
		}

		setLoading(true);
		try {
			const registerPayload: RegisterData = {
				email: formData.email,
				password: formData.password,
				full_name: formData.full_name,
				phone: formData.phone,
				preferred_brand: formData.preferred_brand,
				transaction_pin: formData.transaction_pin,
				website: formData.website,
				form_load_time: formLoadTime,
			};
			await register(registerPayload);
			router.push("/dashboard");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const inputClass =
		"w-full px-4 py-3 bg-white border border-light-300 rounded-lg focus:outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-700/15 transition-all text-neutral-900 text-sm";
	const labelClass =
		"block text-[11px] font-work-sans font-bold mb-1.5 text-navy-900 uppercase tracking-wider";

	return (
		<AuthShell
			title="Open an account"
			subtitle="Takes about 3 minutes. No monthly fees. FDIC-insured to $250,000."
			footer={
				<>
					By opening an account, you agree to the InvBank{" "}
					<Link href="/terms" className="text-navy-700 hover:underline">Terms of Service</Link>
					,{" "}
					<Link href="/privacy" className="text-navy-700 hover:underline">Privacy Notice</Link>
					, and{" "}
					<a href="https://www.fdic.gov/" target="_blank" rel="noopener noreferrer" className="text-navy-700 hover:underline">
						FDIC deposit terms
					</a>
					.
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
					<label htmlFor="full_name" className={labelClass}>Full legal name</label>
					<input
						type="text" id="full_name" name="full_name"
						value={formData.full_name} onChange={handleChange} required
						autoComplete="name" className={inputClass}
						placeholder="Jane Doe"
					/>
				</div>

				<div className="grid sm:grid-cols-2 gap-4">
					<div>
						<label htmlFor="email" className={labelClass}>Email</label>
						<input
							type="email" id="email" name="email"
							value={formData.email} onChange={handleChange} required
							autoComplete="email" className={inputClass}
							placeholder="you@example.com"
						/>
					</div>
					<div>
						<label htmlFor="phone" className={labelClass}>Phone (optional)</label>
						<input
							type="tel" id="phone" name="phone"
							value={formData.phone} onChange={handleChange}
							autoComplete="tel" className={inputClass}
							placeholder="+1 (555) 000-0000"
						/>
					</div>
				</div>

				<div>
					<label htmlFor="preferred_brand" className={labelClass}>Primary account</label>
					<select
						id="preferred_brand" name="preferred_brand"
						value={formData.preferred_brand} onChange={handleChange}
						className={inputClass}
					>
						{ACCOUNT_TYPES.map((t) => (
							<option key={t.value} value={t.value}>{t.label}</option>
						))}
					</select>
					<p className="text-[11px] text-neutral-500 font-gruppo mt-1">You can open additional accounts any time from your dashboard.</p>
				</div>

				<div>
					<label htmlFor="transaction_pin" className={labelClass}>Transaction PIN</label>
					<input
						type="password" id="transaction_pin" name="transaction_pin"
						value={formData.transaction_pin} onChange={handleChange} required
						pattern="[0-9]{6}" maxLength={6} inputMode="numeric"
						className={inputClass} placeholder="6 digits"
					/>
					<p className="text-[11px] text-neutral-500 font-gruppo mt-1">Required to authorize transfers, bill pay, and card changes.</p>
				</div>

				<div className="grid sm:grid-cols-2 gap-4">
					<div>
						<label htmlFor="password" className={labelClass}>Password</label>
						<input
							type="password" id="password" name="password"
							value={formData.password} onChange={handleChange} required
							autoComplete="new-password" minLength={8}
							className={inputClass} placeholder="At least 8 characters"
						/>
					</div>
					<div>
						<label htmlFor="confirmPassword" className={labelClass}>Confirm</label>
						<input
							type="password" id="confirmPassword" name="confirmPassword"
							value={formData.confirmPassword} onChange={handleChange} required
							autoComplete="new-password"
							className={inputClass} placeholder="Repeat password"
						/>
					</div>
				</div>

				{/* Honeypot — hidden from humans, visible to bots */}
				<input
					type="text" name="website" value={formData.website} onChange={handleChange}
					style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true"
				/>

				<button
					type="submit"
					disabled={loading}
					className="w-full px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white rounded-lg font-work-sans font-bold text-sm tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-navy-950/20"
				>
					{loading ? "Creating your account…" : "Open my account"}
				</button>

				<p className="text-[11px] text-neutral-500 font-gruppo leading-relaxed">
					As required by the USA PATRIOT Act Section 326, we collect your name, address, date of birth, and other identifying information to verify your identity.
				</p>
			</form>

			<div className="mt-6 pt-5 border-t border-light-300 text-center text-sm text-neutral-600 font-gruppo">
				Already have an account?{" "}
				<Link href="/login" className="text-navy-700 hover:text-navy-900 font-work-sans font-bold">
					Sign in
				</Link>
			</div>
		</AuthShell>
	);
}
