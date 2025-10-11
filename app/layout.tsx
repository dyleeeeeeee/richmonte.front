"use client";

import { Gruppo, Work_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

// Gruppo: Light, elegant font for subtle text (FAANG UX practice)
const gruppo = Gruppo({ 
  subsets: ["latin"],
  variable: "--font-gruppo",
  weight: ["400"],
});

// Work Sans: Bold, prominent font for visibility
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${gruppo.variable} ${workSans.variable}`}>
      <head>
        {/* Primary Meta Tags - SEO Optimized */}
        <title>Concierge Bank | #1 Private Swiss Banking in USA | Premium Wealth Management</title>
        <meta name="title" content="Concierge Bank | #1 Private Swiss Banking in USA | Premium Wealth Management" />
        <meta name="description" content="Concierge Bank - America's premier private banking institution. Swiss precision banking in USA with exclusive wealth management, luxury financial services, and elite concierge banking for high net worth individuals. FDIC insured, trusted by Fortune 500 executives." />
        <meta name="keywords" content="concierge bank, banks in USA, private banking USA, Swiss bank America, premium bank, luxury banking, wealth management USA, private wealth management, high net worth banking, elite banking services, premium financial services, exclusive banking, Swiss precision banking, Geneva banking USA, Richemont financial, Cartier banking, luxury wealth management, UHNW banking, private bank America, best private banks USA, top banks in USA, concierge banking services, VIP banking, platinum banking, exclusive wealth management" />
        <meta name="author" content="Concierge Bank" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="theme-color" content="#EBA420" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Open Graph / Facebook - SEO Optimized */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://conciergebank.com/" />
        <meta property="og:title" content="Concierge Bank | #1 Private Swiss Banking in USA" />
        <meta property="og:description" content="America's premier private banking institution. Swiss precision meets American excellence. Exclusive wealth management for high net worth individuals. FDIC insured, trusted by Fortune 500." />
        <meta property="og:image" content="https://conciergebank.com/og-image.png" />
        <meta property="og:site_name" content="Concierge Bank" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card - SEO Optimized */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://conciergebank.com/" />
        <meta property="twitter:title" content="Concierge Bank | #1 Private Banking in USA" />
        <meta property="twitter:description" content="America's premier private banking. Swiss precision banking, exclusive wealth management, and elite financial services for high net worth individuals." />
        <meta property="twitter:image" content="https://conciergebank.com/twitter-image.png" />
        
        {/* Additional SEO - USA Focus */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="40.7128;-74.0060" />
        <meta name="ICBM" content="40.7128, -74.0060" />
        <link rel="canonical" href="https://conciergebank.com/" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="global" />
        <meta name="coverage" content="Worldwide" />
        
        {/* Schema.org Structured Data - Enhanced for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BankOrCreditUnion",
              "name": "Concierge Bank",
              "alternateName": "Concierge Bank USA",
              "description": "America's premier private banking institution offering Swiss precision banking, exclusive wealth management, and elite financial services for high net worth individuals.",
              "url": "https://conciergebank.com",
              "logo": "https://conciergebank.com/logos/emblem.png",
              "image": "https://conciergebank.com/logos/banner.png",
              "telephone": "+1-800-CONCIERGE",
              "email": "contact@conciergebank.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Wall Street Financial District",
                "addressLocality": "New York",
                "addressRegion": "NY",
                "postalCode": "10005",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "40.7128",
                "longitude": "-74.0060"
              },
              "parentOrganization": {
                "@type": "Organization",
                "name": "Compagnie Financière Richemont SA",
                "url": "https://www.richemont.com"
              },
              "areaServed": {
                "@type": "Country",
                "name": "United States"
              },
              "serviceType": ["Private Banking", "Wealth Management", "Concierge Banking", "Asset Management", "Investment Advisory"],
              "priceRange": "$$$$",
              "currenciesAccepted": "USD",
              "paymentAccepted": ["Cash", "Credit Card", "Wire Transfer"],
              "openingHours": "Mo-Fr 09:00-18:00",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1250",
                "bestRating": "5",
                "worstRating": "1"
              },
              "sameAs": [
                "https://www.linkedin.com/company/concierge-bank",
                "https://twitter.com/conciergebank",
                "https://www.facebook.com/conciergebank"
              ],
              "brand": {
                "@type": "Brand",
                "name": "Concierge Bank"
              },
              "slogan": "Swiss Precision Banking for America's Elite",
              "knowsAbout": ["Private Banking", "Wealth Management", "High Net Worth Banking", "Swiss Banking", "Concierge Services", "Asset Protection", "Investment Management", "Trust Services", "Estate Planning"],
              "memberOf": {
                "@type": "Organization",
                "name": "FDIC",
                "description": "Federal Deposit Insurance Corporation"
              }
            })
          }}
        />
      </head>
      <body className="font-work-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
