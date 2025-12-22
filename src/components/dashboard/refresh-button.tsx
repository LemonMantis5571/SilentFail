"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function RefreshMonitorsButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleRefresh = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isPending}
            className="text-slate-400 hover:text-white hover:bg-white/10 gap-2"
        >
            <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
            {isPending ? 'Refreshing...' : 'Refresh'}
        </Button>
    );
}
