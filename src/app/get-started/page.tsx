import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { CheckCircle2, Terminal, ArrowRight, ShieldAlert, Clock, Zap } from "lucide-react";
import { Badge } from "~/components/ui/badge";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-300 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
                <ShieldAlert className="h-16 w-16 text-white" />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-[#020817] rounded-full flex items-center justify-center">
                    <div className="h-3 w-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            How SilentFail Works
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Set up your first dead man's switch in less than 2 minutes. We monitor your background jobs and alert you only when they stop working.
          </p>
        </div>

        {/* Steps Container */}
        <div className="grid gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-500/50 via-slate-800 to-transparent -z-10" />

          {/* Step 1 */}
          <div className="relative pl-0 md:pl-20 group">
            <div className="hidden md:flex absolute left-0 top-0 h-14 w-14 items-center justify-center rounded-full border-2 border-indigo-500/30 bg-[#020817] text-xl font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] group-hover:border-indigo-500 transition-colors">
              1
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 md:hidden">
                <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30">Step 1</Badge>
                <h3 className="text-xl font-bold text-white">Create a Monitor</h3>
              </div>
              <h3 className="hidden md:block text-2xl font-bold text-white">Create a Monitor</h3>
              <p className="text-slate-400 leading-relaxed">
                Define the expected schedule for your script. Tell us how often it should run (e.g., every 24 hours) and how much "grace period" (buffer time) to allow for network delays.
              </p>
              
              <Card className="bg-[#0B1121] border-slate-800 shadow-lg">
                <CardContent className="p-6 flex items-center gap-6">
                    <div className="flex flex-col gap-1 items-center justify-center p-4 bg-slate-900/50 rounded-lg border border-slate-800 w-24">
                        <Clock className="h-6 w-6 text-indigo-400" />
                        <span className="text-xs font-mono text-slate-400">1440m</span>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="h-2 w-3/4 bg-slate-800 rounded animate-pulse" />
                        <div className="h-2 w-1/2 bg-slate-800 rounded animate-pulse" />
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative pl-0 md:pl-20 group">
            <div className="hidden md:flex absolute left-0 top-0 h-14 w-14 items-center justify-center rounded-full border-2 border-slate-700 bg-[#020817] text-xl font-bold text-slate-400 group-hover:border-indigo-500 group-hover:text-white transition-colors">
              2
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 md:hidden">
                <Badge className="bg-slate-700/20 text-slate-300">Step 2</Badge>
                <h3 className="text-xl font-bold text-white">Add the Hook</h3>
              </div>
              <h3 className="hidden md:block text-2xl font-bold text-white">Add the Hook</h3>
              <p className="text-slate-400 leading-relaxed">
                Copy the unique ping URL and append it to the end of your script. It's a simple HTTP GET request.
              </p>

              <div className="rounded-lg bg-[#020617] border border-slate-800 overflow-hidden font-mono text-sm relative group/code">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50">
                    <span className="text-xs text-slate-500">backup-script.sh</span>
                    <Terminal className="h-3 w-3 text-slate-500" />
                </div>
                <div className="p-4 space-y-2 text-slate-300">
                    <div className="opacity-50"># ... your existing backup logic ...</div>
                    <div className="opacity-50">pg_dump db - backup.sql</div>
                    <div className="opacity-50 text-indigo-400/50"># 👇 Add this line at the end</div>
                    <div className="flex items-center gap-2 text-emerald-400">
                        <span>curl</span>
                        <span className="text-indigo-300">https://api.silentfail.com/ping/key_123abc</span>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative pl-0 md:pl-20 group">
            <div className="hidden md:flex absolute left-0 top-0 h-14 w-14 items-center justify-center rounded-full border-2 border-slate-700 bg-[#020817] text-xl font-bold text-slate-400 group-hover:border-indigo-500 group-hover:text-white transition-colors">
              3
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 md:hidden">
                <Badge className="bg-slate-700/20 text-slate-300">Step 3</Badge>
                <h3 className="text-xl font-bold text-white">Relax</h3>
              </div>
              <h3 className="hidden md:block text-2xl font-bold text-white">Relax</h3>
              <p className="text-slate-400 leading-relaxed">
                We silently listen for that heartbeat. If your script crashes, hangs, or the server loses power, the signal stops. We'll wait for the grace period, then alert you instantly.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#0B1121] border border-slate-800 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-medium text-white">Email Alerts</span>
                </div>
                <div className="p-4 rounded-lg bg-[#0B1121] border border-slate-800 flex items-center gap-3">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <span className="text-sm font-medium text-white">Dashboard Status</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Footer */}
        <div className="text-center pt-8">
            <Link href="/dashboard">
                <Button size="lg" className="h-14 px-10 text-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 group">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
            </Link>
            <p className="mt-4 text-sm text-slate-500">
                Fully open source and free to use.
            </p>
        </div>

      </div>
    </div>
  );
}