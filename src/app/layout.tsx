import "~/styles/globals.css";

import { type Metadata } from "next";

import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { AuthButtons } from "~/components/nav/auth-buttons";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "SilentFail",
  description: "Dead Man's Switch for Cron Jobs",
  icons: [{ rel: "icon", url: "/favicon.jpg" }],
};

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // 3. Apply variables to HTML so Tailwind can pick them up
    <html lang="en" className={`${sans.variable} ${mono.variable} dark`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">

        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity">
              <div className="relative">
                <ShieldAlert className="h-6 w-6 text-primary" />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-background rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                </div>
              </div>
              {/* Thicker font for logo */}
              <span className="font-extrabold tracking-tight">SilentFail</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
              <Link href="/#features" className="hover:text-primary transition-colors">Features</Link>
              <Link href="/get-started" className="hover:text-primary transition-colors">Get Started</Link>
              <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            </nav>

            <AuthButtons />
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}