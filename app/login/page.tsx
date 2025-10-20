"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import TwoFactorVerification from "@/components/TwoFactorVerification";
import BackupCodeVerification from "@/components/BackupCodeVerification";
import { twoFactorAPI } from "@/lib/api";

type LoginStep = 'credentials' | '2fa' | 'backup';

interface LoginResponse {
  requires_2fa?: boolean;
  user_id?: string;
  email?: string;
  token?: string;
  user?: any;
  error?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginStep, setLoginStep] = useState<LoginStep>('credentials');
  const [twoFAData, setTwoFAData] = useState<{ userId: string; email: string } | null>(null);
  const [twoFAError, setTwoFAError] = useState("");
  const [twoFALoading, setTwoFALoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleCredentialsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Custom login logic to handle 2FA
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.requires_2fa && data.user_id && data.email) {
        // 2FA required - switch to verification step
        setTwoFAData({ userId: data.user_id, email: data.email });
        setLoginStep('2fa');
      } else if (data.token && data.user) {
        // Standard login successful
        localStorage.setItem('auth_token', data.token);
        router.push("/dashboard");
      } else {
        throw new Error('Invalid login response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFAVerify = async (otpCode: string) => {
    if (!twoFAData) return;

    setTwoFAError("");
    setTwoFALoading(true);

    try {
      const response = await twoFactorAPI.verifyOtp({
        user_id: twoFAData.userId,
        email: twoFAData.email,
        otp_code: otpCode,
      });

      if (response.data?.token && response.data?.user) {
        localStorage.setItem('auth_token', response.data.token);
        router.push("/dashboard");
      } else {
        throw new Error('Verification failed');
      }
    } catch (err) {
      setTwoFAError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleBackupCodeVerify = async (backupCode: string) => {
    if (!twoFAData) return;

    setTwoFAError("");
    setTwoFALoading(true);

    try {
      const response = await twoFactorAPI.verifyBackupCode({
        user_id: twoFAData.userId,
        email: twoFAData.email,
        backup_code: backupCode,
      });

      if (response.data?.token && response.data?.user) {
        localStorage.setItem('auth_token', response.data.token);
        router.push("/dashboard");
      } else {
        throw new Error('Backup code verification failed');
      }
    } catch (err) {
      setTwoFAError(err instanceof Error ? err.message : "Backup code verification failed");
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleBackToCredentials = () => {
    setLoginStep('credentials');
    setTwoFAData(null);
    setTwoFAError("");
  };

  const handleUseBackupCode = () => {
    setLoginStep('backup');
    setTwoFAError("");
  };

  const handleBackTo2FA = () => {
    setLoginStep('2fa');
    setTwoFAError("");
  };

  // Show 2FA verification screen
  if (loginStep === '2fa' && twoFAData) {
    return (
      <TwoFactorVerification
        email={twoFAData.email}
        userId={twoFAData.userId}
        onVerify={handleTwoFAVerify}
        onUseBackupCode={handleUseBackupCode}
        onBack={handleBackToCredentials}
        error={twoFAError}
        loading={twoFALoading}
      />
    );
  }

  // Show backup code verification screen
  if (loginStep === 'backup' && twoFAData) {
    return (
      <BackupCodeVerification
        email={twoFAData.email}
        userId={twoFAData.userId}
        onVerify={handleBackupCodeVerify}
        onBack={handleBackTo2FA}
        error={twoFAError}
        loading={twoFALoading}
      />
    );
  }

  // Show credentials login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-50 via-light-100 to-light-200 px-4">
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
          <p className="text-neutral-600 font-gruppo">Access your private vault</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-xl shadow-neutral-900/5 animate-scale-in">
          <form onSubmit={handleCredentialsSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-work-sans font-semibold mb-2 text-neutral-900">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all text-neutral-900"
                placeholder="member@richemont.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-work-sans font-semibold mb-2 text-neutral-900">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all text-neutral-900"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-white border-neutral-300 rounded focus:ring-2 focus:ring-gold-500"
                />
                <span className="text-neutral-600 font-gruppo">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-gold-500 hover:text-gold-400 transition-colors font-gruppo">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg font-work-sans font-bold hover:from-gold-600 hover:to-gold-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold-500/20"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600 font-gruppo">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-gold-500 hover:text-gold-400 font-work-sans font-semibold transition-colors">
              Register now
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-neutral-500 mt-6 font-gruppo">
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
