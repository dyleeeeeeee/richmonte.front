"use client";

import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Head from "next/head";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <Head>
        <title>Concierge Bank | A Richemont Financial Institution</title>
        <meta name="description" content="Luxury banking crafted with Swiss precision. A subsidiary of Richemont Geneva, serving clients who appreciate life's finest pursuits." />
      </Head>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
