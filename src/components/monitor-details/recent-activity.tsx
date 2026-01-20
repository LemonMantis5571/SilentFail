"use client";

import { useState } from "react";
import { type MonitorWithPings } from "~/app/actions/monitor";
import { Button } from "~/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";

type PingEvent = MonitorWithPings['pings'][number];

interface RecentActivityProps {
    pings: PingEvent[];
}

function formatDuration(seconds: number) {
    if (seconds < 1) return `${Math.round(seconds * 1000)}ms`;
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
}

type FilterType = "all" | "slow" | "error";

export function RecentActivity({ pings }: RecentActivityProps) {
    const [filter, setFilter] = useState<FilterType>("all");
    const [dateFilter, setDateFilter] = useState<string>("all");

    const uniqueDates = Array.from(new Set(pings.map(ping =>
        new Date(ping.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    )));

    const filteredPings = pings.filter((ping) => {
        let matchesType = true;
        if (filter === "slow") matchesType = ping.latency > 0.5;

        let matchesDate = true;
        if (dateFilter !== "all") {
            const pingDate = new Date(ping.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            matchesDate = pingDate === dateFilter;
        }

        return matchesType && matchesDate;
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                <div className="flex items-center gap-2">
                    {/* Date Filter */}
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-[140px] h-8 text-xs bg-slate-900 border-slate-800 text-slate-300">
                            <SelectValue placeholder="All Dates" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                            <SelectItem value="all">All Dates</SelectItem>
                            {uniqueDates.map(date => (
                                <SelectItem key={date} value={date} className="focus:bg-slate-800 focus:text-slate-200">
                                    {date}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="h-4 w-[1px] bg-slate-800 mx-1" />

                    <Button
                        variant={filter === "all" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("all")}
                        className="text-xs h-8"
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "slow" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("slow")}
                        className="text-xs h-8"
                    >
                        Slow ({">"}500ms)
                    </Button>
                </div>
            </div>

            <div className="rounded-md border border-slate-800 bg-[#0B1121] overflow-hidden">
                <div className="grid grid-cols-3 gap-4 p-4 border-b border-slate-800 bg-slate-900/50 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <div>Status</div>
                    <div>Time</div>
                    <div className="text-right">Duration</div>
                </div>
                <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto">
                    {filteredPings.map((ping) => (
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
                    {filteredPings.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            {filter === "all" && dateFilter === "all" ? "No logs recorded yet." : "No matching logs found."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
