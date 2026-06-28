import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import RouteTransition from "@/components/layout/RouteTransition";
import ReadingProgress from "@/components/layout/ReadingProgress";
import RouteTheme from "@/components/layout/RouteTheme";

const serif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  axes: ["opsz", "SOFT", "WONK"],
});

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Ryker — 文章与短札",
  description:
    "关于 AI 工程、提示词、代理系统和软件品味的个人博客。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <RouteTheme />
        <ReadingProgress />
        <Nav />
        <main className="mx-auto w-full max-w-6xl px-6">
          <Suspense fallback={children}>
            <RouteTransition>{children}</RouteTransition>
          </Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
