"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#020817] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-md"
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="flex justify-center mb-6"
                >
                    <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
                        <AlertOctagon className="w-10 h-10 text-red-400" />
                    </div>
                </motion.div>

                <h1 className="text-2xl font-bold text-white mb-2">
                    Dashboard Error
                </h1>
                <p className="text-slate-400 mb-6">
                    Failed to load your monitors. This might be a temporary issue.
                </p>

                {error.digest && (
                    <p className="text-slate-600 text-xs font-mono mb-4">
                        ID: {error.digest}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={reset}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        className="border border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Home
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
