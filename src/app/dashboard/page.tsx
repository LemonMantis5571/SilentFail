import { CreateMonitorButton } from "~/components/dashboard/create-monitor";
import { Activity, Clock, ShieldAlert } from "lucide-react";
import { getMonitors } from "../actions/monitor";
import { MonitorList } from "~/components/dashboard/monitor-list";
import { headers } from "next/headers";
import { auth } from "~/server/better-auth";

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
        <MonitorList initialMonitors={monitors} />
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

      <div className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-10 blur-2xl ${color.replace('text-', 'bg-')}`} />
    </div>
  )
}
