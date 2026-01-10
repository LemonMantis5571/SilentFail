"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RefreshCw, Copy, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateApiKey } from "~/app/actions/user";

export function ApiKeySettings({ initialKey }: { initialKey: string | null }) {
    const [apiKey, setApiKey] = useState(initialKey);
    const [isVisible, setIsVisible] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [justCopied, setJustCopied] = useState(false);

    const handleCopy = () => {
        if (!apiKey) return;
        navigator.clipboard.writeText(apiKey);
        setJustCopied(true);
        toast.success("API Key copied to clipboard");
        setTimeout(() => setJustCopied(false), 2000);
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const newKey = await generateApiKey();
            setApiKey(newKey);
            setIsVisible(true);
            toast.success("New API Key generated successfully");
        } catch (error) {
            toast.error("Failed to generate API Key");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card className="bg-[#0B1121] border-slate-800 shadow-sm">
            <CardHeader>
                <CardTitle className="text-white">API Access</CardTitle>
                <CardDescription className="text-slate-500">
                    Manage your personal API Key for accessing the Admin API.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-2">
                    <Label className="text-slate-300">Admin API Key</Label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                value={apiKey || ""}
                                type={isVisible ? "text" : "password"}
                                readOnly
                                placeholder="No API key generated yet"
                                className="bg-slate-950/50 border-slate-800 text-slate-400 font-mono pr-10"
                            />
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsVisible(!isVisible)}
                            disabled={!apiKey}
                            className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-400"
                        >
                            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleCopy}
                            disabled={!apiKey}
                            className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-400"
                        >
                            {justCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/50 pt-4 mt-2">
                    <div className="text-sm text-slate-500">
                        <p className="font-medium text-slate-400" >Authentication Header</p>
                        <code className="bg-slate-900 px-1 py-0.5 rounded text-xs">Authorization: Bearer {apiKey ? (isVisible ? apiKey : "sk_...") : "<YOUR_KEY>"}</code>
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        variant="default"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {isGenerating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        {apiKey ? "Regenerate Key" : "Generate Key"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
