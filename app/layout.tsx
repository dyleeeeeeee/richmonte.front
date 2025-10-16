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
  metadataBase: new URL('https://conciergebank.us'),
  title: {
    default: 'Concierge Bank | #1 Private Swiss Banking in USA | Premium Wealth Management',
    template: '%s | Concierge Bank'
  },
  description: 'Concierge Bank - America\'s premier private banking institution. Swiss precision banking in USA with exclusive wealth management, luxury financial services, and elite concierge banking for high net worth individuals. FDIC insured, trusted by Fortune 500 executives.',
  keywords: ['concierge bank', 'banks in USA', 'private banking USA', 'Swiss bank America', 'premium bank', 'luxury banking', 'wealth management USA', 'private wealth management', 'high net worth banking', 'elite banking services', 'premium financial services', 'exclusive banking', 'Swiss precision banking', 'Geneva banking USA', 'Richemont financial', 'Cartier banking', 'luxury wealth management', 'UHNW banking', 'private bank America', 'best private banks USA', 'top banks in USA', 'concierge banking services', 'VIP banking', 'platinum banking', 'exclusive wealth management'],
  authors: [{ name: 'Concierge Bank' }],
  creator: 'Concierge Bank',
  publisher: 'Concierge Bank',
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
    url: 'https://conciergebank.us/',
    siteName: 'Concierge Bank',
    title: 'Concierge Bank | #1 Private Swiss Banking in USA',
    description: 'America\'s premier private banking institution. Swiss precision meets American excellence. Exclusive wealth management for high net worth individuals. FDIC insured, trusted by Fortune 500.',
    images: [
      {
        url: 'https://conciergebank.us/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Concierge Bank - Swiss Precision Banking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Concierge Bank | #1 Private Banking in USA',
    description: 'America\'s premier private banking. Swiss precision banking, exclusive wealth management, and elite financial services for high net worth individuals.',
    images: ['https://conciergebank.us/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://conciergebank.us/',
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
        <meta name="theme-color" content="#EBA420" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        
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
              "name": "Concierge Bank",
              "alternateName": "Concierge Bank USA",
              "description": "America's premier private banking institution offering Swiss precision banking, exclusive wealth management, and elite financial services for high net worth individuals.",
              "url": "https://conciergebank.us",
              "logo": "https://conciergebank.us/logos/emblem.png",
              "image": "https://conciergebank.us/logos/banner.png",
              "telephone": "+1-800-CONCIERGE",
              "email": "contact@conciergebank.us",
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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
