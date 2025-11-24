import { CreateMonitorButton } from "~/components/dashboard/create-monitor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { MoreVertical, Copy, Trash2, Clock, Activity, ShieldAlert } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { getMonitors, deleteMonitor } from "../actions/monitor";
import { CopyUrlButton } from "~/components/dashboard/copy-button";

export default async function DashboardPage() {
    const monitors = await getMonitors();

    const total = monitors.length;
    const active = monitors.filter(m => m.status === 'UP').length;
    const down = monitors.filter(m => m.status === 'DOWN').length;

    return (
        // REMOVED: "relative overflow-hidden" and the glowing div
        <div className="min-h-screen bg-[#020817] text-slate-300">
            
            <div className="p-8 max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                        <p className="text-slate-400">Monitor your cron jobs and background tasks.</p>
                    </div>
                    <CreateMonitorButton />
                </div>

                {/* Stats Row */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-[#0B1121] border-slate-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Total Monitors</CardTitle>
                            <Activity className="h-4 w-4 text-slate-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{total}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#0B1121] border-slate-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Healthy</CardTitle>
                            <Clock className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-500">{active}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#0B1121] border-slate-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Failing</CardTitle>
                            <ShieldAlert className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-rose-500">{down}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Monitors Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    );
}

function MonitorCard({ monitor }: { monitor: any }) {
    const pingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/ping/${monitor.key}`;

    return (

        <Card className="bg-[#0B1121] border-slate-800 hover:border-blue-500/30 transition-all duration-300 shadow-sm group">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-100">
                        {monitor.name}
                        {monitor.status === 'UP' && <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
                        {monitor.status === 'DOWN' && <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />}
                        {monitor.status === 'PENDING' && <div className="h-2 w-2 rounded-full bg-amber-500" />}
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
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Code Snippet Box */}
                <div className="rounded-md bg-black/40 border border-slate-800 p-3 font-mono text-[10px] flex items-center justify-between group-hover:border-blue-500/20 transition-colors">
                    <div className="truncate mr-2 text-slate-400 group-hover:text-slate-300 transition-colors">
                        <span className="select-none text-blue-500/70">$ </span>
                        curl {pingUrl}
                    </div>
                    <CopyUrlButton url={`curl ${pingUrl}`} />
                </div>

                {/* Last Ping Section */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Last Ping:</span>
                    <span className="text-slate-400">
                        {monitor.lastPing ? new Date(monitor.lastPing).toLocaleString() : 'Never'}
                    </span>
                </div>

            </CardContent>
        </Card>
    );
}