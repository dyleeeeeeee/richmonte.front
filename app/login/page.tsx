"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
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
          <h1 className="text-3xl font-work-sans font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 font-gruppo">Access your private vault</p>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-work-sans font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="member@richemont.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-work-sans font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-dark-900 border border-gold-500/20 rounded-lg focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-dark-900 border-gold-500/20 rounded focus:ring-2 focus:ring-gold-500"
                />
                <span className="text-gray-400 font-gruppo">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-gold-500 hover:text-gold-400 transition-colors font-gruppo">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 rounded-lg font-work-sans font-bold hover:from-gold-400 hover:to-gold-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400 font-gruppo">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-gold-500 hover:text-gold-400 font-work-sans font-semibold transition-colors">
              Register now
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6 font-gruppo">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-gold-500 hover:underline font-gruppo">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-gold-500 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
