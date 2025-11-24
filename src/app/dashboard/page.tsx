import { CreateMonitorButton } from "~/components/dashboard/create-monitor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { MoreVertical, Trash2, Clock, Activity, ShieldAlert, Zap } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { getMonitors, deleteMonitor } from "../actions/monitor";
import { CopyUrlButton } from "~/components/dashboard/copy-button";
import { MonitorSparkline } from "~/components/dashboard/monitor-sparkline";
import Link from "next/link";

export default async function DashboardPage() {
    const monitors = await getMonitors();

    const total = monitors.length;
    const active = monitors.filter(m => m.status === 'UP').length;
    const down = monitors.filter(m => m.status === 'DOWN').length;

    return (
        <div className="min-h-screen bg-[#020817] text-slate-300 font-sans selection:bg-blue-500/30">
            <div className="p-8 max-w-7xl mx-auto space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>

                    </div>
                    <CreateMonitorButton />
                </div>


                <div className="grid gap-6 md:grid-cols-3">
                    <StatsCard title="Total Monitors" value={total} icon={Activity} />
                    <StatsCard title="Healthy" value={active} icon={Clock} color="text-emerald-500" />
                    <StatsCard title="Failing" value={down} icon={ShieldAlert} color="text-rose-500" />
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white tracking-tight">Active Monitors</h2>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {monitors.length === 0 ? (
                            <div className="col-span-full text-center py-20 border rounded-lg border-dashed border-slate-800 bg-[#0B1121]/50">
                                <Activity className="mx-auto h-10 w-10 text-slate-500 mb-4" />
                                <h3 className="text-lg font-medium text-white">No monitors yet</h3>
                                <p className="text-slate-400 mb-4">Create your first dead man's switch to get started.</p>
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
        <Card className="bg-[#0B1121] border-slate-800 shadow-sm transition-all hover:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color === "text-white" ? "text-slate-500" : color}`} />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
            </CardContent>
        </Card>
    )
}

function MonitorCard({ monitor }: { monitor: any }) {
    const pingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/ping/${monitor.key}`;

    return (
        <Card className="bg-[#0B1121] border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-sm group flex flex-col justify-between">
            <div>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-100">
                            {monitor.name}

                            <span className="relative flex h-2 w-2">
                                {monitor.status === 'UP' && (
                                    <>
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </>
                                )}
                                {monitor.status === 'DOWN' && <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>}
                                {monitor.status === 'PENDING' && <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>}
                            </span>
                        </CardTitle>
                        <CardDescription className="text-xs font-mono text-slate-500">
                            {monitor.interval}m interval
                        </CardDescription>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0B1121] border-slate-800 text-slate-300">
                            <DropdownMenuItem onClick={async () => {
                                "use server";
                                await deleteMonitor(monitor.id);
                            }} className="text-rose-500 focus:text-rose-500 focus:bg-rose-500/10 cursor-pointer">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/monitors/${monitor.id}`} className="cursor-pointer">
                                    <Activity className="mr-2 h-4 w-4" /> View Analytics
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>

                <CardContent className="space-y-4 pb-2">

                    <div className="rounded-md bg-black/40 border border-slate-800 p-3 font-mono text-[10px] flex items-center justify-between group-hover:border-slate-700 transition-colors">
                        <div className="truncate mr-2 text-slate-400 group-hover:text-slate-300 transition-colors">
                            <span className="select-none text-blue-500/70">$ </span>
                            curl {pingUrl}
                        </div>
                        <CopyUrlButton url={`curl ${pingUrl}`} />
                    </div>
                    <MonitorSparkline data={monitor.pings} status={monitor.status} />
                </CardContent>
            </div>


            <div className="px-6 pb-4 pt-0">
                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/50 pt-3">
                    <span>Last Ping:</span>
                    <span className="text-slate-400 font-mono">
                        {monitor.lastPing ? new Date(monitor.lastPing).toLocaleString() : 'Never'}
                    </span>
                </div>
            </div>
        </Card>
    );
}