"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ShieldAlert, Loader2, Github } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "~/server/better-auth/client";


function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2763-3.68-.2763-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.0991.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.699.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/></svg>
  );
}

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState<"github" | "discord" | null>(null);

  const handleSocialLogin = async (provider: "github" | "discord") => {
    setLoadingProvider(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error(err);
      toast.error(`Failed to connect to ${provider}`);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-2 hover:opacity-90 transition-opacity">
            <div className="relative">
                <ShieldAlert className="h-12 w-12 text-white" />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-[#020817] rounded-full flex items-center justify-center">
                    <div className="h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                </div>
            </div>
        </Link>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-4">Welcome to SilentFail</h1>
        <p className="text-slate-400 mt-2">The dead man's switch for your cron jobs.</p>
      </div>

      <Card className="w-full max-w-sm bg-[#0B1121] border-slate-800 shadow-2xl relative z-10">
        <CardHeader className="text-center pb-6 pt-8">
          <CardTitle className="text-xl text-white font-medium">
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-slate-500">
            Connect with your developer account to continue
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pb-8">
          
          {/* GitHub Button */}
          <Button 
            variant="outline" 
            className="w-full h-12 bg-[#1e293b] border-slate-700 hover:bg-[#334155] hover:text-white text-slate-200 font-medium relative group overflow-hidden transition-all"
            onClick={() => handleSocialLogin("github")}
            disabled={loadingProvider !== null}
          >
            {loadingProvider === "github" ? (
               <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            ) : (
               <Github className="mr-3 h-5 w-5" />
            )}
            Continue with GitHub
          </Button>

          {/* Discord Button */}
          <Button 
            className="w-full h-12 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium relative group overflow-hidden transition-all border-0"
            onClick={() => handleSocialLogin("discord")}
            disabled={loadingProvider !== null}
          >
            {loadingProvider === "discord" ? (
               <Loader2 className="mr-3 h-5 w-5 animate-spin text-white" />
            ) : (
               <DiscordIcon className="mr-3 h-5 w-5" />
            )}
            Continue with Discord
          </Button>

        </CardContent>
        
        <CardFooter className="border-t border-slate-800/50 bg-slate-900/30 py-6 flex justify-center">
          <p className="text-xs text-slate-500 text-center max-w-[200px]">
            By continuing, you agree to our <Link href="#" className="underline hover:text-slate-400">Terms</Link> and <Link href="#" className="underline hover:text-slate-400">Privacy Policy</Link>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}