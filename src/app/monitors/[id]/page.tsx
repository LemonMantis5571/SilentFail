import { getMonitor } from "~/app/actions/monitor"; // Import the new action
import { notFound } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, Clock, Zap, Activity, Terminal } from "lucide-react";
import Link from "next/link";
import { AnalyticsChart } from "~/components/monitor-details/analytics-charts";

export default async function MonitorPage({ params }: { params: { id: string } }) {
    const monitor = await getMonitor(params.id);

    if (!monitor) return notFound();

    const pings = monitor.pings || [];
    const avgLatency = pings.length > 0
        ? Math.round(pings.reduce((acc, p) => acc + p.latency, 0) / pings.length)
        : 0;

    return (
        <div className="min-h-screen bg-[#020817] text-slate-300 p-8">
            <div className="max-w-6xl mx-auto space-y-8">

             
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            {monitor.name}
                            <Badge variant="outline" className={`
                        ${monitor.status === 'UP' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}
                    `}>
                                {monitor.status}
                            </Badge>
                        </h1>
                        <p className="text-sm text-slate-500 font-mono flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" /> Interval: {monitor.interval}m
                            <span className="text-slate-700">|</span>
                            ID: {monitor.id}
                        </p>
                    </div>
                </div>

             
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Avg Latency" value={`${avgLatency}ms`} icon={Zap} />
                    <StatCard title="Total Pings (24h)" value={pings.length} icon={Activity} />
                    <StatCard title="Uptime (24h)" value="100%" icon={Clock} subtext="No downtime detected" />
                </div>

            
                <Card className="bg-[#0B1121] border-slate-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Latency History</CardTitle>
                        <p className="text-sm text-slate-500">Response time for the last 100 checks.</p>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <AnalyticsChart data={pings} />
                    </CardContent>
                </Card>

       
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                    <div className="rounded-md border border-slate-800 bg-[#0B1121] overflow-hidden">
                        <div className="grid grid-cols-3 gap-4 p-4 border-b border-slate-800 bg-slate-900/50 text-xs font-medium text-slate-500 uppercase tracking-wider">
                            <div>Status</div>
                            <div>Time</div>
                            <div className="text-right">Latency</div>
                        </div>
                        <div className="divide-y divide-slate-800">
                            {pings.map((ping) => (
                                <div key={ping.id} className="grid grid-cols-3 gap-4 p-4 text-sm hover:bg-slate-800/30 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                        <span className="text-emerald-400 font-medium">Success</span>
                                    </div>
                                    <div className="text-slate-400 font-mono">
                                        {new Date(ping.createdAt).toLocaleString()}
                                    </div>
                                    <div className="text-right font-mono text-slate-300">
                                        {ping.latency}ms
                                    </div>
                                </div>
                            ))}
                            {pings.length === 0 && (
                                <div className="p-8 text-center text-slate-500">No logs recorded yet.</div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, subtext }: any) {
    return (
        <Card className="bg-[#0B1121] border-slate-800">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <span className="text-sm font-medium text-slate-500">{title}</span>
                    <Icon className="h-4 w-4 text-slate-500" />
                </div>
                <div className="text-2xl font-bold text-white mt-2">{value}</div>
                {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
            </CardContent>
        </Card>
    )
}