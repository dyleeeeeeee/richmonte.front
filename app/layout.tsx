"use client";

import { Gruppo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const gruppo = Gruppo({ 
  subsets: ["latin"],
  variable: "--font-gruppo",
  weight: ["400"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={gruppo.variable}>
      <head>
        {/* Primary Meta Tags */}
        <title>Concierge Bank | Private Swiss Banking | Compagnie Financière Richemont SA Subsidiary</title>
        <meta name="title" content="Concierge Bank | Private Swiss Banking | Compagnie Financière Richemont SA Subsidiary" />
        <meta name="description" content="Exclusive private banking and wealth management services from Geneva. A subsidiary of Compagnie Financière Richemont SA, serving Cartier, Van Cleef & Arpels, and distinguished Maison clientele with Swiss precision and discretion." />
        <meta name="keywords" content="private banking, Swiss bank, Geneva banking, Richemont bank, luxury banking, wealth management, private wealth, Swiss precision, Cartier banking, Van Cleef banking, elite banking, Maison Richemont, Compagnie Financière Richemont SA, concierge banking, premium banking services, Swiss financial services, Geneva wealth management, exclusive banking, high net worth banking, UHNW banking, Swiss private bank" />
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
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://conciergebank.com/" />
        <meta property="og:title" content="Concierge Bank | Private Swiss Banking | Richemont Subsidiary" />
        <meta property="og:description" content="Exclusive private banking from Geneva. A subsidiary of Compagnie Financière Richemont SA, serving distinguished clientele with Swiss precision." />
        <meta property="og:image" content="https://conciergebank.com/og-image.png" />
        <meta property="og:site_name" content="Concierge Bank" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://conciergebank.com/" />
        <meta property="twitter:title" content="Concierge Bank | Private Swiss Banking" />
        <meta property="twitter:description" content="Exclusive private banking from Geneva. A subsidiary of Compagnie Financière Richemont SA." />
        <meta property="twitter:image" content="https://conciergebank.com/twitter-image.png" />
        
        {/* Additional SEO */}
        <meta name="geo.region" content="CH-GE" />
        <meta name="geo.placename" content="Geneva" />
        <meta name="geo.position" content="46.204391;6.143158" />
        <meta name="ICBM" content="46.204391, 6.143158" />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "Concierge Bank",
              "description": "Private Swiss banking and wealth management services",
              "url": "https://conciergebank.com",
              "logo": "https://conciergebank.com/logos/emblem.png",
              "image": "https://conciergebank.com/logos/banner.png",
              "telephone": "+41-22-123-4567",
              "email": "contact@conciergebank.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rue du Rhône",
                "addressLocality": "Geneva",
                "postalCode": "1204",
                "addressCountry": "CH"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "46.204391",
                "longitude": "6.143158"
              },
              "parentOrganization": {
                "@type": "Organization",
                "name": "Compagnie Financière Richemont SA",
                "url": "https://www.richemont.com"
              },
              "areaServed": "Worldwide",
              "serviceType": ["Private Banking", "Wealth Management", "Concierge Services"],
              "priceRange": "$$$$"
            })
          }}
        />
      </head>
      <body className="font-gruppo antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
