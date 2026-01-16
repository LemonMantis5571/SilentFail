"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CopyUrlButton } from "~/components/dashboard/copy-button";

interface UrlDisplayProps {
    url: string;
}

export function UrlDisplay({ url }: UrlDisplayProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Mask the URL - show only the base path, hide the key
    const maskedUrl = url.replace(/\/api\/ping\/.*$/, "/api/ping/••••••••••••");

    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md bg-slate-950 border border-slate-800 p-2 font-mono text-xs text-slate-300 truncate">
                {isVisible ? url : maskedUrl}
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={() => setIsVisible(!isVisible)}
                title={isVisible ? "Hide URL" : "Show URL"}
            >
                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <CopyUrlButton url={url} />
        </div>
    );
}
