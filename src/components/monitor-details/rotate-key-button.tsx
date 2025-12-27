"use client";

import { useState } from "react";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { rotateMonitorKey } from "~/app/actions/monitor";
import { toast } from "sonner";

export function RotateKeyButton({ monitorId }: { monitorId: string }) {
    const [loading, setLoading] = useState(false);

    const handleRotate = async () => {
        try {
            setLoading(true);
            await rotateMonitorKey(monitorId);
            toast.success("Monitor key regenerated successfully");
        } catch (error) {
            toast.error("Failed to regenerate key");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-amber-400 border-amber-500/20 hover:bg-amber-500/10 hover:text-amber-300">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Regenerate Key
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#0f172a] border-slate-700 text-slate-300">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Regenerate Monitor Key?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                        This action cannot be undone. The current ping URL will immediately stop working.
                        <br /><br />
                        You will need to update all your scripts and crontabs with the new URL.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleRotate}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                        Yes, regenerate it
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
