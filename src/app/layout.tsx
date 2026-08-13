import type { Metadata } from "next";
import { Geist, Geist_Mono, Goudy_Bookletter_1911, Inter } from "next/font/google";
import "./globals.css";

const goudy = Goudy_Bookletter_1911({
  variable: "--font-goudy",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Agentic Data Company",
  description:
    "Conversational data at frontier scale for the labs training the next era of speech models.",
  metadataBase: new URL("https://theagenticdatacompany.com"),
  openGraph: {
    title: "The Agentic Data Company",
    description:
      "Conversational data at frontier scale for the labs training the next era of speech models.",
    url: "https://theagenticdatacompany.com",
    siteName: "The Agentic Data Company",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Agentic Data Company",
    description:
      "Conversational data at frontier scale for the labs training the next era of speech models.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${goudy.variable} ${inter.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
