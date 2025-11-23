import Link from "next/link";
import {
  ShieldAlert,
  Zap,
  CheckCircle2,
  ArrowRight,
  Code2
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { AuthButtons } from "~/components/nav/auth-buttons";

export default function Home() {
  return (
 
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
        <main>
          {/* Hero Section */}
          <section className="relative pt-20 pb-32 md:pt-32 overflow-hidden">
            {/* Background Gradient Spotlights for Dark Mode */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 opacity-50" />

            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-12">

                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left space-y-8">
                  <Badge variant="outline" className="px-4 py-1 border-primary/30 text-primary bg-primary/10 rounded-full backdrop-blur-sm">
                    <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-primary inline-block shadow-[0_0_10px_currentColor]"></span>
                    New: AI Log Analysis
                  </Badge>

                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    The <span className="text-primary bg-clip-text">Dead Man's Switch</span> <br />
                    for your Cron Jobs.
                  </h1>

                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    You have backup scripts. But do they actually run?
                    SilentFail listens for a heartbeat. If your script goes silent, we wake you up.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                      Start Monitoring Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent border-primary/20 hover:bg-primary/10">
                      View Documentation
                    </Button>
                  </div>

                  <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Free Tier Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>No Credit Card</span>
                    </div>
                  </div>
                </div>

                {/* Visual/Code Block */}
                <div className="flex-1 w-full max-w-lg lg:max-w-xl">
                  <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl text-card-foreground shadow-2xl overflow-hidden group">
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/20">
                      <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                      <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
                      <div className="ml-2 text-xs text-muted-foreground font-mono">bash — 80x24</div>
                    </div>
                    <div className="p-6 font-mono text-sm space-y-4 bg-[#0a0a0a] text-green-400">
                      <div className="flex">
                        <span className="text-blue-400 mr-2">~</span>
                        <span className="text-slate-500"># 1. Your backup script runs...</span>
                      </div>
                      <div>
                        <span className="text-blue-400 mr-2">➜</span>
                        <span className="text-slate-100">pg_dump database &gt; backup.sql</span>
                      </div>
                      <div className="flex">
                        <span className="text-blue-400 mr-2">~</span>
                        <span className="text-slate-500"># 2. Tell SilentFail it worked</span>
                      </div>
                      <div>
                        <span className="text-blue-400 mr-2">➜</span>
                        <span className="text-slate-100">curl </span>
                        <span className="text-yellow-300">https://api.silentfail.com/ping/5f9a2b</span>
                      </div>
                      <div className="pt-4 text-white">
                        <span className="text-green-500">✔</span> 200 OK. Heartbeat received.
                      </div>
                    </div>
                  </div>
                  {/* Decorative blob behind code */}
                  <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features" className="py-24 bg-muted/5 border-y border-border/40">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold tracking-tight mb-4">More than just a ping</h2>
                <p className="text-muted-foreground text-lg">
                  Simple enough for a bash script, smart enough to debug your stack traces.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Zero Config</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      No SDKs to install. No complex agents. Just a simple URL. If you can make an HTTP request, you can monitor it.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                      <Code2 className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>AI Crash Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      Pipe your error logs to us. Our AI parses the stack trace and emails you exactly <span className="text-primary font-medium">why</span> the script failed and how to fix it.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                      <ShieldAlert className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Smart Grace Periods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      We learn how long your jobs usually take. If a 5-minute backup suddenly takes 2 seconds, we'll flag it as suspicious.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold tracking-tight">Set up in seconds</h2>
                  <div className="space-y-6">
                    {[
                      { title: "Create a Monitor", desc: "Give it a name and an expected schedule (e.g., 'Every 24 hours')." },
                      { title: "Add the Hook", desc: "Append our curl command to the end of your script or CI/CD pipeline." },
                      { title: "Sleep Soundly", desc: "We only alert you if the signal goes dark. No signal = Alarm." }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="flex-none h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{step.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent blur-[100px]" />
                  <div className="relative bg-card/80 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl p-8 ring-1 ring-white/10">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <div className="font-medium text-lg">Database Backup</div>
                        <div className="text-sm text-muted-foreground">Expected: Every 24h</div>
                      </div>
                      <Badge className="bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]">Healthy</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Ping</span>
                        <span className="font-mono text-foreground/80">Today, 04:00 AM</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Next Expected</span>
                        <span className="font-mono text-foreground/80">Tomorrow, 04:00 AM</span>
                      </div>
                      <div className="h-2 w-full bg-muted/50 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-primary w-[30%] rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 border-t border-border/40 relative">
            <div className="absolute inset-0 bg-primary/5 blur-3xl pointer-events-none" />
            <div className="container mx-auto px-4 text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Stop guessing if your cron jobs ran.
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join developers who sleep better knowing SilentFail is watching their background tasks.
              </p>
              <Button size="lg" className="h-12 px-10 text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                Start Monitoring Now
              </Button>
            </div>
          </section>
        </main>

        <footer className="py-8 border-t border-border/40 bg-muted/10">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© 2024 SilentFail. Built by a Developer for Developers.</div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
            </div>
          </div>
        </footer>
      </div >
  );
}