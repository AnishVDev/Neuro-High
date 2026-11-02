import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import ProgressProvider from "@/components/ProgressProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--f-display",
  weight: ["400", "500", "600", "700", "800"],
});

const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--f-body",
  weight: ["400", "500", "600", "700"],
});

const mono = Space_Mono({
  subsets: ["latin"],
  variable: "--f-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "NEURO//HIGH — Demystify AI. Run the future.",
  description:
    "An AI learning portal for grades 9–12. Learn how machine learning actually works, master the tools, and own the ethics — while building a literal neural network with your progress.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} scroll-pt-20`}>
      <body className="grain dotgrid antialiased">
        <ProgressProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ProgressProvider>
      </body>
    </html>
  );
}
