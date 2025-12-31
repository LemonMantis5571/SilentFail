"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Code2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

interface IntegrationsModalProps {
    monitorKey: string;
    secret?: string | null;
}

type Language = "curl" | "python" | "javascript" | "go";

export function IntegrationsModal({ monitorKey, secret }: IntegrationsModalProps) {

    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Language>("curl");
    const [copied, setCopied] = useState(false);



    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://silentfail.com"; // Fallback
    let pingUrl = `${baseUrl}/api/ping/${monitorKey}`;

    if (secret) {
        pingUrl += `?secret=${secret}`;
    }

    const snippets: Record<Language, string> = {
        curl: `curl ${pingUrl}`,
        python: `import requests\n\nrequests.get("${pingUrl}")`,
        javascript: `fetch("${pingUrl}");`,
        go: `package main\n\nimport (\n\t"net/http"\n)\n\nfunc main() {\n\thttp.Get("${pingUrl}")\n}`,
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(snippets[activeTab]);
            setCopied(true);
            toast.success("Snippet copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-indigo-400 ml-1"
                >
                    <Code2 className="h-4 w-4" />
                    <span className="sr-only">Integrations</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-1/2 bg-[#0f172a] border-slate-700 text-slate-200">
                <DialogHeader>
                    <DialogTitle className="text-white">Integration Snippets</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Choose your language to get the ping code.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-4 pt-4">

                    {/* Tabs */}
                    <div className="flex space-x-2 border-b border-slate-700 pb-1">
                        {(["curl", "python", "javascript", "go"] as Language[]).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => {
                                    setActiveTab(lang);
                                    setCopied(false);
                                }}
                                className={cn(
                                    "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-1.5 focus:outline-none capitalize",
                                    activeTab === lang
                                        ? "border-indigo-500 text-indigo-400"
                                        : "border-transparent text-slate-400 hover:text-slate-200"
                                )}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>

                    {/* Code Area */}
                    <div className="relative group">
                        <div className="absolute right-2 top-2 z-10">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                                <span className="sr-only">Copy code</span>
                            </Button>
                        </div>
                        <pre className="p-4 rounded-lg bg-[#020617] border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre min-h-[100px] flex items-center">
                            <code>{snippets[activeTab]}</code>
                        </pre>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
