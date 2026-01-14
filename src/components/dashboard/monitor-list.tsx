"use client";

import { useState, useMemo } from "react";
import { type MonitorWithPings } from "~/app/actions/monitor";
import { MonitorCard } from "~/components/dashboard/monitor-card";
import { Input } from "~/components/ui/input";
import { Activity, Search, ArrowUpDown, AlertTriangle } from "lucide-react";
import { CreateMonitorButton } from "~/components/dashboard/create-monitor";
import { RefreshMonitorsButton } from "~/components/dashboard/refresh-button";
import { ErrorBoundary } from "~/components/ui/error-boundary";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";

interface MonitorListProps {
    initialMonitors: MonitorWithPings[];
}

type SortOrder = "newest" | "oldest";

export function MonitorList({ initialMonitors }: MonitorListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

    const filteredAndSortedMonitors = useMemo(() => {
        let result = [...initialMonitors];


        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (monitor) =>
                    monitor.name.toLowerCase().includes(query) ||
                    monitor.key.toLowerCase().includes(query)
            );
        }

        result.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();

            if (sortOrder === "newest") {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });

        return result;
    }, [initialMonitors, searchQuery, sortOrder]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">Active Monitors</h2>

                    <div className="ml-2">
                        <RefreshMonitorsButton />
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search monitors..."
                            className="pl-9 bg-[#0B1121] border-white/10 text-slate-300 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Sort Select */}
                    <Select value={sortOrder} onValueChange={(value: string) => setSortOrder(value as SortOrder)}>
                        <SelectTrigger className="w-[140px] bg-[#0B1121] border-white/10 text-slate-300">
                            <ArrowUpDown className="mr-2 h-4 w-4 text-slate-500" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0B1121] border-slate-700 text-slate-300">
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedMonitors.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 border border-dashed border-white/10 bg-white/5 rounded-xl">
                        {searchQuery ? (
                            <>
                                <Search className="h-12 w-12 text-slate-500 mb-4 opacity-50" />
                                <h3 className="text-xl font-bold text-white">No monitors found</h3>
                                <p className="text-slate-400 mb-6 font-medium">Try adjusting your search query.</p>
                                <Button variant="outline" onClick={() => setSearchQuery("")} className="border-white/10 text-slate-300 hover:text-white hover:bg-white/10">
                                    Clear Search
                                </Button>
                            </>
                        ) : (
                            <>
                                <Activity className="h-12 w-12 text-slate-500 mb-4 opacity-50" />
                                <h3 className="text-xl font-bold text-white">No monitors yet</h3>
                                <p className="text-slate-400 mb-6 font-medium">Create your first dead man's switch to get started.</p>
                                <CreateMonitorButton />
                            </>
                        )}
                    </div>
                ) : (
                    filteredAndSortedMonitors.map((monitor) => (
                        <ErrorBoundary
                            key={monitor.id}
                            fallback={
                                <div className="bg-[#0B1121] border border-red-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                    <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
                                    <p className="text-white font-medium mb-1">Failed to load monitor</p>
                                    <p className="text-slate-500 text-sm">{monitor.name}</p>
                                </div>
                            }
                        >
                            <MonitorCard monitor={monitor} />
                        </ErrorBoundary>
                    ))
                )}
            </div>
        </div>
    );
}
