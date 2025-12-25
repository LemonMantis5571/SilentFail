import { getMonitor } from "~/app/actions/monitor";
import { notFound } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowLeft, Clock, Zap, Activity, AlertTriangle, TrendingDown } from "lucide-react";
import Link from "next/link";
import { AnalyticsChart } from "~/components/monitor-details/analytics-charts";
import { auth } from "~/server/better-auth";
import { headers } from "next/headers";

function formatDuration(seconds: number) {
    if (seconds < 1) return `${Math.round(seconds * 1000)}ms`;
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
}

// Format downtime duration from minutes
function formatDowntime(minutes: number): string {
    if (minutes === 0) return "0m";

    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);

    if (hours > 0) {
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
}

// Calculate accurate downtime from downtime records
function calculateAccurateDowntime(downtimes: any[], hours: number = 24) {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - hours * 60 * 60 * 1000);

    let totalDowntimeMinutes = 0;

    // Filter downtimes that overlap with the window [cutoffTime, now]
    const relevantDowntimes = downtimes.filter(d => {
        const start = new Date(d.startedAt);
        const end = d.endedAt ? new Date(d.endedAt) : now;
        return start < now && end > cutoffTime;
    });

    relevantDowntimes.forEach(d => {
        const start = new Date(d.startedAt);
        const end = d.endedAt ? new Date(d.endedAt) : now;

        // Clamp to window
        const clampedStart = start < cutoffTime ? cutoffTime : start;
        const clampedEnd = end > now ? now : end;

        const durationMs = clampedEnd.getTime() - clampedStart.getTime();
        const durationMinutes = Math.round(durationMs / (1000 * 60));

        totalDowntimeMinutes += durationMinutes;
    });

    const activeDowntime = downtimes.find(d => !d.endedAt);

    // Calculate uptime percentage
    const totalMinutes = hours * 60;
    const uptimePercentage = ((totalMinutes - totalDowntimeMinutes) / totalMinutes) * 100;

    return {
        totalDowntimeMinutes: Math.min(totalDowntimeMinutes, totalMinutes),
        uptimePercentage: Math.max(0, Math.min(100, uptimePercentage)),
        activeDowntime: !!activeDowntime,
        incidentCount: relevantDowntimes.length
    };
}

export default async function MonitorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const monitor = await getMonitor(id);
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!monitor) return notFound();

    if (!session) {
        return null
    }

    const pings = monitor.pings || [];
    const downtimes = monitor.downtimes || [];
    const intervalSeconds = monitor.interval * 60;

    // CALCULATE AVG DRIFT (Delay)
    const avgDrift = pings.length > 0
        ? pings.reduce((acc, p) => {
            const drift = Math.max(0, p.latency - intervalSeconds);
            return acc + drift;
        }, 0) / pings.length
        : 0;

    // Calculate downtime metrics
    const downtimeMetrics = calculateAccurateDowntime(downtimes, 24);

    return (
        <div className="min-h-screen bg-[#020817] text-slate-300 p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Navigation Header */}
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
                ${monitor.status === 'UP' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                ${monitor.status === 'DOWN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
                ${monitor.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
              `}>
                                {monitor.status}
                            </Badge>
                        </h1>
                        <p className="text-sm text-slate-500 font-mono flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" /> Interval: {monitor.interval}m
                            <span className="text-slate-700">|</span>
                            Grace: {monitor.gracePeriod}m {monitor.useSmartGrace && "(Smart)"}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Uptime (24h)"
                        value={`${downtimeMetrics.uptimePercentage.toFixed(2)}%`}
                        icon={Activity}
                        colorClass={
                            downtimeMetrics.uptimePercentage >= 99
                                ? "text-emerald-400"
                                : downtimeMetrics.uptimePercentage >= 95
                                    ? "text-amber-400"
                                    : "text-rose-400"
                        }
                        subtext={downtimeMetrics.activeDowntime ? "Currently down" : "All systems operational"}
                    />
                    <StatCard
                        title="Total Pings"
                        value={pings.length}
                        icon={TrendingDown}
                        subtext="Last 100 checks"
                    />


                    <StatCard
                        title="Downtime (24h)"
                        value={formatDowntime(downtimeMetrics.totalDowntimeMinutes)}
                        icon={AlertTriangle}
                        colorClass={downtimeMetrics.totalDowntimeMinutes === 0 ? "text-emerald-400" : "text-rose-400"}
                        subtext={`${downtimeMetrics.incidentCount} incident${downtimeMetrics.incidentCount !== 1 ? 's' : ''}`}
                    />

                    <StatCard
                        title="Avg Delay"
                        value={formatDuration(avgDrift)}
                        icon={Zap}
                        subtext="Past scheduled run"
                    />


                </div>

                {/* Downtime Incidents */}
                {downtimes.length > 0 && (
                    <Card className="bg-[#0B1121] border-slate-800 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-slate-200">Recent Incidents</CardTitle>
                            <p className="text-sm text-slate-500">Downtime events in the last 24 hours.</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {downtimes.slice(0, 10).map((downtime) => {
                                    const isOngoing = !downtime.endedAt;
                                    const duration = isOngoing
                                        ? Math.floor((new Date().getTime() - new Date(downtime.startedAt).getTime()) / (1000 * 60))
                                        : downtime.duration;

                                    return (
                                        <div key={downtime.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-2 w-2 rounded-full ${isOngoing ? 'bg-rose-500 animate-pulse' : 'bg-slate-500'}`} />
                                                <div>
                                                    <div className="text-sm font-medium text-slate-200">
                                                        {isOngoing ? 'Ongoing Incident' : 'Resolved'}
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-mono">
                                                        Started: {new Date(downtime.startedAt).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-sm font-semibold ${isOngoing ? 'text-rose-400' : 'text-slate-300'}`}>
                                                    {formatDowntime(duration || 0)}
                                                </div>
                                                {!isOngoing && (
                                                    <div className="text-xs text-slate-500 font-mono">
                                                        Ended: {new Date(downtime.endedAt!).toLocaleString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Main Chart Section */}
                <Card className="bg-[#0B1121] border-slate-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Timing History</CardTitle>
                        <p className="text-sm text-slate-500">Actual run intervals for recent checks.</p>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <AnalyticsChart data={pings} />
                    </CardContent>
                </Card>

                {/* Recent Logs List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                    <div className="rounded-md border border-slate-800 bg-[#0B1121] overflow-hidden">
                        <div className="grid grid-cols-3 gap-4 p-4 border-b border-slate-800 bg-slate-900/50 text-xs font-medium text-slate-500 uppercase tracking-wider">
                            <div>Status</div>
                            <div>Time</div>
                            <div className="text-right">Duration</div>
                        </div>
                        <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto">
                            {pings.map((ping) => (
                                <div key={ping.id} className="grid grid-cols-3 gap-4 p-4 text-sm hover:bg-slate-800/30 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                        <span className="text-emerald-400 font-medium">Success</span>
                                    </div>
                                    <div className="text-slate-400 font-mono text-xs">
                                        {new Date(ping.createdAt).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        })}
                                    </div>
                                    <div className="text-right font-mono text-slate-300">
                                        {formatDuration(ping.latency)}
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

function StatCard({ title, value, icon: Icon, subtext, colorClass = "text-white" }: any) {
    return (
        <Card className="bg-[#0B1121] border-slate-800">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <span className="text-sm font-medium text-slate-500">{title}</span>
                    <Icon className="h-4 w-4 text-slate-500" />
                </div>
                <div className={`text-2xl font-bold ${colorClass} mt-2`}>{value}</div>
                {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
            </CardContent>
        </Card>
    );
}