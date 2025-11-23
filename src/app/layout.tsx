import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthButtons } from "~/components/nav/auth-buttons";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "SilentFail",
  description: "Dead Man's Switch for Cron Jobs",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
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
              <span>SilentFail</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/#features" className="hover:text-primary transition-colors">Features</Link>
              <Link href="/#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
              <Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link>
            </nav>
            
            <AuthButtons />
          </div>
        </header>
        {children}
           <Toaster />
      </body>
    </html>
  );
}