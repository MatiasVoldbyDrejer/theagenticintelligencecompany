import type { Metadata } from "next";
import { Goudy_Bookletter_1911, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "The Agentic Intelligence Co.",
  description:
    "We record real people in real conversations, at the scale a frontier lab requires, and deliver the resulting corpora to the teams training the models that will define the next era of computing.",
  metadataBase: new URL("https://theagenticintelligencecompany.com"),
  openGraph: {
    title: "The Agentic Intelligence Co.",
    description:
      "Conversational data at frontier scale for the labs training the next era of speech models.",
    url: "https://theagenticintelligencecompany.com",
    siteName: "The Agentic Intelligence Co.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Agentic Intelligence Co.",
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
    <html lang="en" className={`${goudy.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
