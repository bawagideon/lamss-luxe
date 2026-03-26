import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthModal } from "@/components/AuthModal";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  "name": "Lamssé Luxe",
  "description": "Leading fashion clothes, affordable women's clothing, and community for queens.",
  "url": "https://www.lamsseluxe.ca",
  "telephone": "+18000000000",
  "email": "support@lamsseluxe.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Fashion District",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "addressCountry": "CA"
  },
  "sameAs": [
    "https://instagram.com/lamsseluxe.ca"
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lamsseluxe.ca"),
  title: {
    default: "Lamssé Luxe | Leading Fashion Clothes & Affordable Women's Clothing",
    template: "%s | Lamssé Luxe - Best Fashion Store"
  },
  description: "Shop the best fashion store online at Lamssé Luxe. Leading fashion clothes, affordable women's clothing, two-piece sets, and elegant dresses for the unabashed Soft Life Queen. Join the premier women's community.",
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
    "Lamssé Luxe"
  ],
  openGraph: {
    title: "Lamssé Luxe - The Best Ecommerce Fashion Store",
    description: "Discover affordable women's clothing and leading fashion clothes. Join a women's community of queens.",
    url: "https://www.lamsseluxe.ca",
    siteName: "Lamssé Luxe",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lamssé Luxe | Leading Fashion Clothes",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen pt-28 md:pt-40">
            {children}
          </main>
          <AuthModal />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
