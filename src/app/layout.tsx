import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Preload fonts for better performance
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "AxiomID - The Human Authorization Protocol",
    template: "%s | AxiomID"
  },
  description: "Prove human intent behind AI actions with decentralized identity verification. Built by Mohamed Abdelaziz.",
  keywords: [
    "decentralized identity",
    "human verification",
    "AI authorization",
    "blockchain identity",
    "sybil resistance",
    "trust score",
    "web3 identity"
  ],
  authors: [{ name: "Mohamed Abdelaziz", url: "https://github.com/Moeabdelaziz007" }],
  creator: "Mohamed Abdelaziz",
  publisher: "AxiomID",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://axiomid.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "AxiomID - The Human Authorization Protocol",
    description: "Prove human intent behind AI actions with decentralized identity verification",
    url: 'https://axiomid.app',
    siteName: 'AxiomID',
    images: [
      {
        url: '/axiomid-banner.png',
        width: 1200,
        height: 630,
        alt: 'AxiomID - Human Authorization Protocol',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AxiomID - The Human Authorization Protocol",
    description: "Prove human intent behind AI actions with decentralized identity verification",
    images: ['/axiomid-banner.png'],
    creator: '@Moeabdelaziz007',
  },
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
  verification: {
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-oled text-white min-h-screen overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
