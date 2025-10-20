"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import type { RegisterData } from "@/lib/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    preferred_brand: "Cartier",
    website: "", // Honeypot field
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

    setLoading(true);

    try {
      const registerPayload: Partial<RegisterData> = {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
        preferred_brand: formData.preferred_brand,
        website: formData.website, // Honeypot for bot detection
        form_load_time: formLoadTime, // Timing check for bot detection
      };
      await register(registerPayload as any);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-50 via-light-100 to-light-200 px-4 py-12">
        <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
            <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
              <Image
                src="/logos/emblem.png"
                alt="Concierge Bank"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <span className="font-work-sans text-3xl font-extrabold">
              Concierge<span className="text-gold-500 group-hover:text-gold-400 transition-colors">Bank</span>
            </span>
          </Link>
          <h1 className="text-3xl font-work-sans font-bold mb-2">Request Membership</h1>
          <p className="text-neutral-600 font-gruppo">Join the distinguished circle of Richemont clientele</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-xl shadow-neutral-900/5 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="full_name" className="block text-sm font-work-sans font-semibold mb-2 text-neutral-900">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all text-neutral-900"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-work-sans font-semibold mb-2 text-neutral-900">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all text-neutral-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-work-sans font-semibold mb-2 text-neutral-900">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all text-neutral-900"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label htmlFor="preferred_brand" className="block text-sm font-work-sans font-semibold mb-2 text-neutral-900">
                Preferred Richemont Brand
              </label>
              <select
                id="preferred_brand"
                name="preferred_brand"
                value={formData.preferred_brand}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all text-neutral-900"
              >
                <option value="Cartier" className="text-neutral-900">Cartier</option>
                <option value="Van Cleef & Arpels" className="text-neutral-900">Van Cleef & Arpels</option>
                <option value="Montblanc" className="text-neutral-900">Montblanc</option>
                <option value="Jaeger-LeCoultre" className="text-neutral-900">Jaeger-LeCoultre</option>
                <option value="IWC Schaffhausen" className="text-neutral-900">IWC Schaffhausen</option>
                <option value="Panerai" className="text-neutral-900">Panerai</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-work-sans font-semibold mb-2 text-neutral-900">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all text-neutral-900"
                placeholder="••••••••"
              />
              <p className="text-xs text-neutral-500 mt-1 font-gruppo">Must be at least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-work-sans font-semibold mb-2 text-neutral-900">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all text-neutral-900"
                placeholder="••••••••"
              />
            </div>

            {/* Honeypot field - hidden from humans, visible to bots */}
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-work-sans font-bold hover:from-gold-600 hover:to-gold-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold-500/20"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600 font-gruppo">
            Already have an account?{" "}
            <Link href="/login" className="text-gold-500 hover:text-gold-400 font-work-sans font-semibold transition-colors">
              Sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-neutral-500 mt-6 font-gruppo">
          By registering, you agree to our{" "}
          <Link href="/terms" className="text-gold-500 hover:underline font-gruppo">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-gold-500 hover:underline font-gruppo">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
