"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0B1121] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-lg"
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="flex justify-center mb-6"
                >
                    <div className="p-5 rounded-full bg-red-500/10 border border-red-500/20">
                        <AlertOctagon className="w-12 h-12 text-red-400" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-3xl font-bold text-white mb-3">
                        Something Went Wrong
                    </h1>
                    <p className="text-slate-400 mb-2">
                        An unexpected error occurred while processing your request.
                    </p>
                    {error.digest && (
                        <p className="text-slate-500 text-sm font-mono mb-6">
                            Error ID: {error.digest}
                        </p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6 text-left"
                >
                    <p className="text-red-400 text-sm font-mono break-all">
                        {error.message || "Unknown error"}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    <Button
                        onClick={reset}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        className="border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-slate-600 text-sm"
                >
                    If this keeps happening, please check the console or contact support.
                </motion.p>
            </motion.div>
        </div>
    );
}
