"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface ReCaptchaProps {
  siteKey: string;
}

/**
 * Google reCAPTCHA v3 Component
 * Invisible bot protection with score-based verification
 * FAANG-level security implementation
 */
export default function ReCaptcha({ siteKey }: ReCaptchaProps) {
  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.head.removeChild(script);
    };
  }, [siteKey]);

  return null;
}

/**
 * Execute reCAPTCHA verification
 * @param action - The action name (e.g., 'register', 'login')
 * @returns Promise<string> - The reCAPTCHA token
 */
export async function executeRecaptcha(action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error('reCAPTCHA not loaded'));
      return;
    }

    window.grecaptcha.ready(() => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        reject(new Error('reCAPTCHA site key not configured'));
        return;
      }

      window.grecaptcha
        .execute(siteKey, { action })
        .then((token: string) => {
          resolve(token);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  });
}
