import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RouteTransition from "@/components/RouteTransition";
import ReadingProgress from "@/components/ReadingProgress";

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
  title: "Ryker — An editorial blog",
  description:
    "An editorial, literary blog on AI engineering, prompting, and craft.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
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
