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
import { Plus, Loader2 } from "lucide-react";
import { createMonitor } from "~/app/actions/monitor";
import { toast } from "sonner";
import { Switch } from "../ui/switch";

export function CreateMonitorButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [interval, setInterval] = useState("1440"); // Default 24h
  const [gracePeriod, setGracePeriod] = useState("5"); // Default 5m
  const [useSmartGrace, setUseSmartGrace] = useState<boolean | undefined>(false);
  const [secret, setSecret] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createMonitor({
        name,
        interval: parseInt(interval),
        gracePeriod: parseInt(gracePeriod), // Pass it to the backend
        smartGrace: useSmartGrace,
        secret: secret || undefined
      });
      setOpen(false);
      setName("");
      setInterval("1440");
      setGracePeriod("5");
      setSecret("");
      toast.success("Monitor created successfully");
    } catch (error) {
      toast.error("Failed to create monitor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-lg shadow-primary/20 hover:cursor-pointer text-white bg-blue-600 hover:bg-blue-500">
          <Plus className="mr-2 h-4 w-4" /> New Monitor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Monitor</DialogTitle>
          <DialogDescription>
            Configure how often your script runs and how patient we should be.
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
            Create Monitor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}