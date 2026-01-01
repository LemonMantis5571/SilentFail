"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Loader2, Settings2 } from "lucide-react";
import { updateMonitor } from "~/app/actions/monitor";
import { toast } from "sonner";
import { Switch } from "../ui/switch";

interface EditMonitorModalProps {
    monitor: {
        id: string;
        name: string;
        interval: number;
        gracePeriod: number;
        useSmartGrace: boolean;
        secret: string | null;
    }
}

export function EditMonitorModal({ monitor }: EditMonitorModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(monitor.name);
    const [secret, setSecret] = useState(monitor.secret || "");
    const [interval, setInterval] = useState(monitor.interval.toString());
    const [gracePeriod, setGracePeriod] = useState(monitor.gracePeriod.toString());
    const [useSmartGrace, setUseSmartGrace] = useState<boolean | undefined>(monitor.useSmartGrace);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await updateMonitor(monitor.id, {
                name,
                interval: parseInt(interval),
                gracePeriod: parseInt(gracePeriod),
                smartGrace: useSmartGrace,
                secret: secret || undefined
            });
            setOpen(false);
            toast.success("Monitor updated successfully");
        } catch (error) {
            toast.error("Failed to update monitor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex h-8 gap-2 bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-300 hover:cursor-pointer">
                    <Settings2 className="h-3.5 w-3.5" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Monitor</DialogTitle>
                    <DialogDescription>
                        Update configuration for {monitor.name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/20">
                        <div className="space-y-0.5">
                            <Label className="text-base">Smart Grace Period</Label>
                            <div className="text-[10px] text-muted-foreground">
                                Automatically adjust buffer based on historical run times.
                            </div>
                        </div>
                        <Switch
                            checked={useSmartGrace}
                            onCheckedChange={setUseSmartGrace}
                        />
                    </div>
                    {/* Name Field */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Friendly Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Production DB Backup"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Secret Field */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="secret">Secret (Optional)</Label>
                        </div>
                        <Input
                            id="secret"
                            type="password"
                            placeholder="Secret key for authentication"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                        />
                        <p className="text-[10px] text-muted-foreground">If set, requests must include `?secret=YOUR_SECRET` or Bearer token.</p>
                    </div>

                    {/* Time Settings Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="interval">Interval (min)</Label>
                            <div className="relative">
                                <Input
                                    id="interval"
                                    type="number"
                                    min="1"
                                    value={interval}
                                    onChange={(e) => setInterval(e.target.value)}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground">Expected frequency</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="grace">Grace Period (min)</Label>
                            <div className="relative">
                                <Input
                                    id="grace"
                                    type="number"
                                    min="0"
                                    value={gracePeriod}
                                    onChange={(e) => setGracePeriod(e.target.value)}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground">Buffer before alerting</p>
                        </div>
                    </div>

                </div>
                <DialogFooter>
                    <Button variant={"secondary"} className="hover:cursor-pointer" onClick={handleSubmit} disabled={loading || !name}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
