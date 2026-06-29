import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cyber2 Sports - Live Sports Streaming Aggregator & Scores",
  description: "Watch live sports streams in full HD with real-time score updates, live chat, and match stats. Access multiple fast streaming servers for Football, Cricket, Basketball, WWE, and Tennis.",
  keywords: ["live sports", "sports aggregator", "football stream", "live scores", "cricket stream", "wwe stream", "sports script", "SaaS theme", "cyber2 sports"],
  authors: [{ name: "Cyber2 Sports Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
