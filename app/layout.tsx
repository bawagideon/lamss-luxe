import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthModal } from "@/components/AuthModal";
import { Toaster } from "react-hot-toast";
import { PageTransition } from "@/components/PageTransition";
import { JsonLd } from "@/components/JsonLd";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit'
});


export const metadata: Metadata = {
  metadataBase: new URL("https://www.luxenetwork.ca"),
  title: {
    default: "Luxe Network | House of Luxury Drops & Streetwear",
    template: "%s | Luxe Network - Premium Fashion"
  },
  description: "Shop the best fashion store online at Luxe Network. Leading fashion clothes, affordable women's clothing, two-piece sets, and elegant dresses for the unabashed Soft Life Queen. Join the premier women's community.",
  keywords: [
    "fashion online", 
    "fashion store", 
    "leading fashion clothes", 
    "ecommerce fashion store", 
    "affordable women's clothing", 
    "women's community", 
    "clothes for queens", 
    "best store", 
    "best fashion store",
    "women's clothing online",
    "Luxe Network"
  ],
  openGraph: {
    title: "Luxe Network - The Best Ecommerce Fashion Store",
    description: "Discover affordable women's clothing and leading fashion clothes. Join a women's community of queens.",
    url: "https://www.luxenetwork.ca",
    siteName: "Luxe Network",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxe Network | Leading Fashion Clothes",
    description: "Affordable women's clothing and luxury two-pieces for the ultimate Soft Life experience.",
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body className={outfit.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div className="h-28 md:h-40 bg-background/95 animate-pulse" />}>
            <Navbar />
          </Suspense>
          <PageTransition>
            <main className="min-h-screen pt-20 md:pt-32">
              {children}
            </main>
          </PageTransition>
          <AuthModal />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
