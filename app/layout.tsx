import type { Metadata } from "next";
import { Gruppo, Work_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

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

export const metadata: Metadata = {
  metadataBase: new URL('https://invbank.us'),
  title: {
    default: 'InvBank | Banking Built for Your Ambition | FDIC Insured',
    template: '%s | InvBank'
  },
  description: 'InvBank — modern American banking with no monthly fees, no maintenance fees, and no overdraft fees. Personal banking, business growth, and financial advice, backed by FDIC insurance and the full faith of the U.S. Government.',
  keywords: ['InvBank', 'online banking USA', 'FDIC insured bank', 'no fee checking', 'business banking', 'personal banking', 'lending', 'wealth management', 'credit cards', 'mobile banking', 'digital banking', 'investment trading', 'trading platform'],
  authors: [{ name: 'InvBank' }],
  creator: 'InvBank',
  publisher: 'InvBank',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://invbank.us/',
    siteName: 'InvBank',
    title: 'InvBank | Banking Built for Your Ambition',
    description: 'Modern American banking built for ambition. No monthly fees. Real-time alerts. Instant transfers. FDIC insured.',
    images: [
      {
        url: 'https://invbank.us/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InvBank - Banking Built for Your Ambition',
        type: 'image/png',
      },
      {
        url: 'https://invbank.us/twitter-image.png',
        width: 1200,
        height: 600,
        alt: 'InvBank - Next-Gen Digital Banking',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@invbank',
    creator: '@invbank',
    title: 'InvBank | Banking Built for Your Ambition',
    description: 'Modern American banking. No monthly fees. Real-time alerts. Instant transfers. FDIC insured.',
    images: [
      {
        url: 'https://invbank.us/twitter-image.png',
        alt: 'InvBank - Next-Gen Digital Banking',
      },
    ],
  },
  other: {
    'og:image:secure_url': 'https://invbank.us/og-image.png',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/png',
    'og:site_name': 'InvBank',
    'article:author': 'InvBank',
    'article:publisher': 'https://www.facebook.com/invbank',
  },
  alternates: {
    canonical: 'https://invbank.us/',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${gruppo.variable} ${workSans.variable}`}>
      <head>
        {/* Additional Meta Tags */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="color-scheme" content="light only" />
        <meta name="theme-color" content="#2C3E5A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Enhanced Social Media Meta Tags */}
        <meta property="og:title" content="InvBank | Banking Built for Your Ambition" />
        <meta property="og:description" content="Modern American banking. No monthly fees. Real-time alerts. Instant transfers. FDIC insured." />
        <meta property="og:image" content="https://invbank.us/og-image.png" />
        <meta property="og:image:secure_url" content="https://invbank.us/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="InvBank - Banking Built for Your Ambition" />
        <meta property="og:url" content="https://invbank.us/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="InvBank" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@invbank" />
        <meta name="twitter:creator" content="@invbank" />
        <meta name="twitter:title" content="InvBank | Banking Built for Your Ambition" />
        <meta name="twitter:description" content="Modern American banking. No monthly fees. Real-time alerts. Instant transfers. FDIC insured." />
        <meta name="twitter:image" content="https://invbank.us/twitter-image.png" />
        <meta name="twitter:image:alt" content="InvBank - Next-Gen Digital Banking" />
        
        {/* WhatsApp and Telegram specific optimizations */}
        <meta property="article:author" content="InvBank" />
        <meta property="article:publisher" content="https://www.facebook.com/invbank" />
        
        {/* Favicon - Optimized for Google Search */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Additional favicon declarations for better Google support */}
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <meta name="msapplication-TileImage" content="/favicon-32x32.png" />
        <meta name="msapplication-TileColor" content="#203760" />
        
        
        {/* Geo Tags - USA Focus */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="40.7128;-74.0060" />
        <meta name="ICBM" content="40.7128, -74.0060" />
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
              "name": "InvBank",
              "alternateName": "InvBank USA",
              "description": "InvBank — modern American banking built for your ambition. Personal banking, business growth, lending, and wealth management with no monthly fees.",
              "url": "https://invbank.us",
              "logo": "https://invbank.us/logos/emblem.png",
              "image": "https://invbank.us/logos/banner.png",
              "telephone": "+1-800-INVBANK",
              "email": "contact@invbank.us",
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
              "areaServed": {
                "@type": "Country",
                "name": "United States"
              },
              "serviceType": ["Personal Banking", "Business Banking", "Credit Cards", "Lending", "Wealth Management", "Investment Trading"],
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
                "https://www.linkedin.com/company/invbank",
                "https://twitter.com/invbank",
                "https://www.facebook.com/invbank"
              ],
              "brand": {
                "@type": "Brand",
                "name": "InvBank"
              },
              "slogan": "Banking Built for Your Ambition",
              "knowsAbout": ["Personal Banking", "Business Banking", "Credit Cards", "Lending", "Wealth Management", "Investment Trading", "FDIC Insurance"],
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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
