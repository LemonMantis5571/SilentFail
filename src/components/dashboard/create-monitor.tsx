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
  DialogDescription, // Added Description for context
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { createMonitor } from "~/app/actions/monitor";
import { toast } from "sonner"; 

export function CreateMonitorButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [interval, setInterval] = useState("1440"); // Default 24h
  const [gracePeriod, setGracePeriod] = useState("5"); // Default 5m

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createMonitor({ 
          name, 
          interval: parseInt(interval),
          gracePeriod: parseInt(gracePeriod) // Pass it to the backend
      });
      setOpen(false);
      setName("");
      setInterval("1440");
      setGracePeriod("5");
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
        <Button className="shadow-lg shadow-primary/20">
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
          <Button onClick={handleSubmit} disabled={loading || !name}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create Monitor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}