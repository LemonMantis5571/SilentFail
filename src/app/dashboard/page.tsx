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

    // Simple stats
    const total = monitors.length;
    const active = monitors.filter(m => m.status === 'UP').length;
    const down = monitors.filter(m => m.status === 'DOWN').length;

    return (
        // FIX 1: Added 'text-foreground' here so text turns white in dark mode
        <div className="min-h-screen bg-background text-foreground p-8 dark">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                        <p className="text-muted-foreground">Monitor your cron jobs and background tasks.</p>
                    </div>
                    <CreateMonitorButton />
                </div>

                {/* Stats Row */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* FIX 2: Changed bg-muted/10 to bg-card for better visibility */}
                    <Card className="bg-card border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Monitors</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{total}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Healthy</CardTitle>
                            <Clock className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">{active}</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Failing</CardTitle>
                            <ShieldAlert className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{down}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Monitors Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {monitors.length === 0 ? (
                        // FIX 3: Made the empty state lighter so it doesn't disappear
                        <div className="col-span-full text-center py-20 border rounded-lg border-dashed border-border bg-card/50">
                            <Activity className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-4" />
                            <h3 className="text-lg font-medium text-foreground">No monitors yet</h3>
                            <p className="text-muted-foreground mb-4">Create your first dead man's switch to get started.</p>
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
        // FIX 4: Ensured card background is solid 'bg-card'
        <Card className="bg-card border-border hover:border-primary/50 transition-colors shadow-sm group">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                        {monitor.name}
                        {monitor.status === 'UP' && <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />}
                        {monitor.status === 'DOWN' && <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
                        {monitor.status === 'PENDING' && <div className="h-2 w-2 rounded-full bg-yellow-500" />}
                    </CardTitle>
                    <CardDescription className="text-xs font-mono text-muted-foreground">
                        {monitor.interval}m interval
                    </CardDescription>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={async () => {
                            "use server";
                            await deleteMonitor(monitor.id);
                        }} className="text-destructive focus:text-destructive cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-md bg-muted/50 border border-border/50 p-3 font-mono text-[10px] flex items-center justify-between group-hover:border-primary/20 transition-colors">
                    <div className="truncate mr-2 text-muted-foreground group-hover:text-foreground transition-colors">
                        <span className="select-none text-muted-foreground/50">$ </span>
                        curl {pingUrl}
                    </div>

                    <CopyUrlButton url={`curl ${pingUrl}`} />
                </div>

                {/* Last Ping Section */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last Ping:</span>
                    <span>
                        {monitor.lastPing ? new Date(monitor.lastPing).toLocaleString() : 'Never'}
                    </span>
                </div>

            </CardContent>
        </Card>
    );
}