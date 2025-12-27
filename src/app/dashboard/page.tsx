import { CreateMonitorButton } from "~/components/dashboard/create-monitor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { MoreVertical, Trash2, Clock, Activity, ShieldAlert, Zap, Terminal, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { getMonitors, deleteMonitor, type MonitorWithPings } from "../actions/monitor";
import { CopyUrlButton } from "~/components/dashboard/copy-button";
import { MonitorSparkline } from "~/components/dashboard/monitor-sparkline";
import { RefreshMonitorsButton } from "~/components/dashboard/refresh-button";
import Link from "next/link";

import { headers } from "next/headers";
import { auth } from "~/server/better-auth";
import { DeleteMonitorItem } from "~/components/dashboard/delete-monitor-item";

export default async function DashboardPage() {
  const monitors = await getMonitors();
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const total = monitors.length;
  const active = monitors.filter(m => m.status === 'UP').length;
  const down = monitors.filter(m => m.status === 'DOWN').length;

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020817] text-slate-300 font-sans selection:bg-indigo-500/30">
      <div className="p-8 max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Dashboard</h1>
            <p className="text-slate-400 font-medium">Overview of your infrastructure status.</p>
          </div>
          <CreateMonitorButton />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard title="Total Monitors" value={total} icon={Activity} />
          <StatsCard title="Healthy" value={active} icon={Clock} color="text-emerald-400" />
          <StatsCard title="Failing" value={down} icon={ShieldAlert} color="text-rose-500" />
        </div>

        {/* Monitors Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Active Monitors</h2>
            </div>
            <RefreshMonitorsButton />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {monitors.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-24 border border-dashed border-white/10 bg-white/5 rounded-xl">
                <Activity className="h-12 w-12 text-slate-500 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white">No monitors yet</h3>
                <p className="text-slate-400 mb-6 font-medium">Create your first dead man's switch to get started.</p>
                <CreateMonitorButton />
              </div>
            ) : (
              monitors.map((monitor) => (
                <MonitorCard key={monitor.id} monitor={monitor} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color = "text-white" }: any) {
  return (
    <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-[#0B1121] p-6 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-bold text-slate-400 tracking-wide uppercase">{title}</span>
        <Icon className={`h-5 w-5 ${color === "text-white" ? "text-slate-500" : color}`} />
      </div>
      <div className={`text-4xl font-black mt-2 ${color}`}>{value}</div>
      {/* Subtle glow effect */}
      <div className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-10 blur-2xl ${color.replace('text-', 'bg-')}`} />
    </div>
  )
}

function MonitorCard({ monitor }: { monitor: MonitorWithPings }) {
  const pingUrl = `${process.env.NEXT_PUBLIC_APP_URL}api/ping/${monitor.key}`;

  return (
    <Card className="bg-[#0B1121] border-white/10 hover:border-indigo-500/50 transition-all duration-300 shadow-lg group flex flex-col justify-between overflow-hidden">
      <div>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="space-y-1.5">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
              {monitor.name}

              {/* Modern Status Dot */}
              <span className="relative flex h-2.5 w-2.5">
                {monitor.status === 'UP' && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                  </>
                )}
                {monitor.status === 'DOWN' && <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>}
                {monitor.status === 'PENDING' && <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>}
              </span>
            </CardTitle>

            <div className="flex items-center gap-3">
              <CardDescription className="text-xs font-bold flex gap-4 text-slate-400 bg-white/5 px-2 py-1 rounded-md">
                {monitor.interval}m interval


              </CardDescription>
              <CardDescription className="text-xs font-bold flex gap-4 text-slate-400 bg-white/5 px-2 py-1 rounded-md">
                {monitor.gracePeriod}m grace
              </CardDescription>
              {monitor.useSmartGrace && (
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Smart
                </span>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-slate-500 hover:text-white hover:bg-white/10">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0f172a] border-slate-700 text-slate-300">
              <DropdownMenuItem asChild>
                <Link href={`/monitors/${monitor.id}`} className="cursor-pointer font-medium">
                  <Activity className="mr-2 h-4 w-4" /> Details
                </Link>
              </DropdownMenuItem>

              <DeleteMonitorItem id={monitor.id} name={monitor.name} />
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="space-y-5 pb-2">
          {/* Code Snippet Box - High Contrast */}
          <div className="rounded-lg bg-[#020617] border border-white/10 p-3 font-mono text-[11px] font-medium flex items-center justify-between group-hover:border-indigo-500/30 transition-colors shadow-inner">
            <div className="truncate mr-3 text-slate-400 group-hover:text-slate-200 transition-colors">
              <span className="select-none text-indigo-400 font-bold">$ </span>
              curl {pingUrl}
            </div>
            <CopyUrlButton url={`curl ${pingUrl}`} />
          </div>

          {/* Sparkline */}
          <div className="h-10">
            <MonitorSparkline data={monitor.pings} status={monitor.status} />
          </div>
        </CardContent>
      </div>

      {/* Footer Area */}
      <div className="px-6 pb-4 pt-0">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 border-t border-white/5 pt-3">
          <span>Last Heartbeat</span>
          <span className={`font-mono ${monitor.lastPing ? 'text-slate-300' : 'text-slate-600'}`}>
            {monitor.lastPing ? new Date(monitor.lastPing).toLocaleTimeString() : 'Waiting...'}
          </span>
        </div>
      </div>
    </Card>
  );
}