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
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Plus, Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner"; 
import { createMonitor } from "~/app/actions/monitor";

export function CreateMonitorButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>("");
  const [interval, setInterval] = useState("1440"); // Default 24 hours

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createMonitor({ name, interval: parseInt(interval) });
      setOpen(false);
      setName("");
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
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Friendly Name</Label>
            <Input
              id="name"
              placeholder="e.g. Production DB Backup"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interval">Expected Interval (Minutes)</Label>
            <div className="flex gap-2">
                <Input
                id="interval"
                type="number"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                />
                <Button variant="outline" size="icon" title="Ask AI (Coming Soon)">
                    <Wand2 className="h-4 w-4 text-primary" />
                </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading || !name}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}