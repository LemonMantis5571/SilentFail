
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { MoreVertical, Activity, Zap } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type MonitorWithPings } from "~/app/actions/monitor";
import { CopyUrlButton } from "~/components/dashboard/copy-button";
import { MonitorSparkline } from "~/components/dashboard/monitor-sparkline";
import { IntegrationsModal } from "~/components/dashboard/integration-modal";
import Link from "next/link";
import { DeleteMonitorItem } from "~/components/dashboard/delete-monitor-item";

export function MonitorCard({ monitor }: { monitor: MonitorWithPings }) {


    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://silentfail.com";
    let pingUrl = `${baseUrl}/api/ping/${monitor.key}`;

    if (monitor.secret) {
        pingUrl += `?secret=${monitor.secret}`;
    }

    return (
        <Card className="bg-[#0B1121] border-white/10 hover:border-indigo-500/50 transition-all duration-300 shadow-lg group flex flex-col justify-between overflow-hidden">
            <div>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                    <div className="space-y-1.5">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                            {monitor.name}


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

                    <div className="rounded-lg bg-[#020617] border border-white/10 p-3 font-mono text-[11px] font-medium flex items-center justify-between group-hover:border-indigo-500/30 transition-colors shadow-inner">
                        <div className="truncate mr-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                            <span className="select-none text-indigo-400 font-bold">$ </span>
                            curl {pingUrl}
                        </div>
                        <div className="flex items-center">
                            <CopyUrlButton url={`curl ${pingUrl}`} />
                            <IntegrationsModal monitorKey={monitor.key} secret={monitor.secret} />
                        </div>
                    </div>

                    <div className="h-10">
                        <MonitorSparkline data={monitor.pings} status={monitor.status} />
                    </div>
                </CardContent>
            </div>

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
