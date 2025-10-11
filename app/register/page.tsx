"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { RegisterData } from "@/lib/api";
import ReCaptcha, { executeRecaptcha } from "@/components/ReCaptcha";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    preferred_brand: "Cartier",
  });
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
      // Execute reCAPTCHA verification (invisible bot protection)
      let recaptchaToken = '';
      try {
        recaptchaToken = await executeRecaptcha('register');
      } catch (recaptchaError) {
        console.warn('reCAPTCHA verification failed:', recaptchaError);
        // Continue without token in development, but log the error
      }

      const registerPayload: Partial<RegisterData> = {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
        preferred_brand: formData.preferred_brand,
        recaptcha_token: recaptchaToken, // Anti-bot token
      };
      await register(registerPayload as any);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  return (
    <>
      {/* Load reCAPTCHA script */}
      {siteKey && <ReCaptcha siteKey={siteKey} />}
      
      <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4 py-12">
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
          <p className="text-gray-400 font-gruppo">Join the distinguished circle of Richemont clientele</p>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="full_name" className="block text-sm font-work-sans font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-work-sans font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-work-sans font-semibold mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label htmlFor="preferred_brand" className="block text-sm font-work-sans font-semibold mb-2">
                Preferred Richemont Brand
              </label>
              <select
                id="preferred_brand"
                name="preferred_brand"
                value={formData.preferred_brand}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
              >
                <option value="Cartier">Cartier</option>
                <option value="Van Cleef & Arpels">Van Cleef & Arpels</option>
                <option value="Montblanc">Montblanc</option>
                <option value="Jaeger-LeCoultre">Jaeger-LeCoultre</option>
                <option value="IWC Schaffhausen">IWC Schaffhausen</option>
                <option value="Panerai">Panerai</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-work-sans font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1 font-gruppo">Must be at least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-work-sans font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 rounded-lg font-work-sans font-bold hover:from-gold-400 hover:to-gold-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Bot Protection Badge */}
          <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Shield size={14} className="text-green-500" />
            <span className="font-gruppo">Protected by Google reCAPTCHA</span>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400 font-gruppo">
            Already have an account?{" "}
            <Link href="/login" className="text-gold-500 hover:text-gold-400 font-work-sans font-semibold transition-colors">
              Sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6 font-gruppo">
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
    </>
  );
}
