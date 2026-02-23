import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DashboardNav from "@/components/DashboardNav";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Campus Memory - Event Management System",
  description:
    "AI-Powered Campus Event Management. ML-driven poster analysis, automated attendance tracking, and intelligent OD management.",
  keywords: [
    "campus management",
    "event management",
    "ML poster analysis",
    "automated attendance",
    "education technology",
    "smart campus",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased min-h-screen`}>
        <DashboardNav />
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
