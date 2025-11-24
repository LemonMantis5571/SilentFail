"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ShieldAlert, Loader2, Github, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "~/server/better-auth/client";

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGithubLoading, setIsGithubLoading] = useState(false);

    // 1. Handle GitHub Login (The Primary Way)
    const handleGithubLogin = async () => {
        setIsGithubLoading(true);
        try {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/dashboard", // Redirect here on success
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to connect to GitHub");
            setIsGithubLoading(false);
        }
    };


    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isSignUp) {

                await authClient.signUp.email({
                    email,
                    password,
                    name,
                    callbackURL: "/dashboard",
                }, {
                    onRequest: () => setIsLoading(true),
                    onSuccess: () => router.push("/dashboard"),
                    onError: (ctx) => {
                        toast.error(ctx.error.message);
                        setIsLoading(false);
                    }
                });
            } else {
                await authClient.signIn.email({
                    email,
                    password,
                    callbackURL: "/dashboard",
                }, {
                    onRequest: () => setIsLoading(true),
                    onSuccess: () => router.push("/dashboard"),
                    onError: (ctx) => {
                        toast.error(ctx.error.message);
                        setIsLoading(false);
                    }
                });
            }
        } catch (err) {
            console.log(err)
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020817] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="mb-8 text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="relative">
                        <ShieldAlert className="h-10 w-10 text-white" />
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-[#020817] rounded-full flex items-center justify-center">
                            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                        </div>
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">SilentFail</h1>
                <p className="text-slate-400">Dead man's switch for your cron jobs</p>
            </div>

            <Card className="w-full max-w-md bg-[#0B1121] border-slate-800 shadow-xl relative z-10">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl text-white">
                        {isSignUp ? "Create an account" : "Welcome back"}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        {isSignUp ? "Start monitoring your scripts in seconds" : "Login to manage your monitors"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Button
                        variant="outline"
                        className="w-full h-11 bg-slate-900 border-slate-700 hover:bg-slate-800 hover:text-white text-slate-200 font-medium relative group overflow-hidden"
                        onClick={handleGithubLogin}
                        disabled={isGithubLoading || isLoading}
                    >
                        {isGithubLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Github className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                        )}
                        Continue with GitHub
                        {/* Subtle glow effect on hover */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0B1121] px-2 text-slate-500">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        {isSignUp && (
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:ring-blue-500/20 focus:border-blue-500/50"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="dev@example.com"
                                className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:ring-blue-500/20 focus:border-blue-500/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-300">Password</Label>
                                {!isSignUp && (
                                    <Link href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot?</Link>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:ring-blue-500/20 focus:border-blue-500/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium"
                            disabled={isLoading || isGithubLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSignUp ? "Create Account" : "Sign In"}
                      
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 border-t border-slate-800 bg-slate-950/30 py-4">
                    <div className="text-center text-sm text-slate-400">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all"
                        >
                            {isSignUp ? "Sign in" : "Sign up"}
                        </button>
                    </div>
                </CardFooter>
            </Card>

            <div className="mt-8 text-center text-xs text-slate-500 max-w-sm">
                By clicking continue, you agree to our <Link href="#" className="underline hover:text-slate-400">Terms of Service</Link> and <Link href="#" className="underline hover:text-slate-400">Privacy Policy</Link>.
            </div>
        </div>
    );
}