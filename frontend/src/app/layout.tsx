import type { Metadata } from "next";
import Script from "next/script";
import Providers from "@/components/providers/Providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Metrix Gaming Platform",
    default: "Metrix Gaming Platform - Compete, Spectate, Earn",
  },
  description:
    "Join Metrix, the premier gaming tournament platform where players compete and spectators earn by verifying matches.",
  keywords: [
    "gaming",
    "esports",
    "tournaments",
    "spectator",
    "earn money",
    "competitive gaming",
  ],
  authors: [{ name: "Metrix Team" }],
  creator: "Metrix Gaming Platform",
  publisher: "Metrix Gaming Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Metrix Gaming Platform",
    title: "Metrix Gaming Platform - Compete, Spectate, Earn",
    description:
      "Join Metrix, the premier gaming tournament platform where players compete and spectators earn by verifying matches.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Metrix Gaming Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Metrix Gaming Platform - Compete, Spectate, Earn",
    description:
      "Join Metrix, the premier gaming tournament platform where players compete and spectators earn by verifying matches.",
    images: ["/og-image.png"],
    creator: "@metrixgaming",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/logo.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/logo.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/logo.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0F131A" />
        <meta name="msapplication-TileColor" content="#0F131A" />
        <meta name="google-adsense-account" content="ca-pub-3437812813438383" />
      </head>
      <body className="font-sans antialiased w-full">
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3437812813438383"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Providers>
          <div className="w-full min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
