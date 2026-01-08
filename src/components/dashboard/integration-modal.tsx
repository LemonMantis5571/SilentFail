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
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-go";
import "prismjs/components/prism-bash";
import { useAppConfig } from "~/hooks/use-app-config";

interface IntegrationsModalProps {
    monitorKey: string;
    secret?: string | null;
}

type Language = "curl" | "python" | "javascript" | "go";

export function IntegrationsModal({ monitorKey, secret }: IntegrationsModalProps) {

    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Language>("curl");
    const [copied, setCopied] = useState(false);
    const { config } = useAppConfig();



    const baseUrl = config.appUrl || (typeof window !== 'undefined' ? window.location.origin : "");
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
                    <div className="relative group rounded-lg overflow-hidden border border-slate-700/50 shadow-lg">
                        {/* Editor Header Bar */}
                        <div className="flex items-center justify-between px-4 py-2 bg-linear-to-r from-slate-800/80 to-slate-800/60 border-b border-slate-700/50">
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <span className="text-xs font-medium text-slate-300 ml-2">
                                    {activeTab === "curl" ? "bash" : activeTab}
                                    {activeTab === "python" ? ".py" : activeTab === "javascript" ? ".js" : activeTab === "go" ? ".go" : ".sh"}
                                </span>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <Check className="h-3.5 w-3.5 text-green-400" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                )}
                                <span className="sr-only">Copy code</span>
                            </Button>
                        </div>

                        {/* Code Content */}
                        <div className="bg-[#0d1117] p-4 overflow-x-hidden border-t border-slate-800">
                            <pre className="text-sm font-mono">
                                <code className="block max-w-full break-all whitespace-pre-wrap">
                                    {(() => {
                                        const code = snippets[activeTab];
                                        const lines = code.split('\n');
                                        const showLineNumbers = lines.length > 1;


                                        const prismLang = activeTab === "curl" ? "bash" : activeTab;


                                        const grammar = Prism.languages[prismLang];
                                        const highlightedCode = grammar
                                            ? Prism.highlight(code, grammar, prismLang)
                                            : code;


                                        const highlightedLines = highlightedCode.split('\n');

                                        return highlightedLines.map((line, idx) => (
                                            <div key={idx} className="flex">
                                                {showLineNumbers && (
                                                    <span className="select-none text-slate-600 mr-4 text-right w-4">
                                                        {idx + 1}
                                                    </span>
                                                )}
                                                <span
                                                    className="flex-1 break-all"
                                                    dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
                                                />
                                            </div>
                                        ));
                                    })()}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
