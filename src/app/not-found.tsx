"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0B1121] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-md"
            >

                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="relative mb-8"
                >
                    <h1 className="text-[150px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-600 leading-none">
                        404
                    </h1>
                    <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 -z-10" />
                </motion.div>


                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center mb-6"
                >
                    <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold text-white mb-3">
                        Page Not Found
                    </h2>
                    <p className="text-slate-400 mb-8">
                        The page you're looking for doesn't exist or has been moved.
                        Maybe the monitor you were tracking... silently failed.
                    </p>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    <Button
                        asChild
                        variant="ghost"
                        className="border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Link>
                    </Button>
                    <Button
                        asChild
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                    >
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 text-slate-600 text-sm font-mono"
                >
                    ERROR_CODE: SILENT_FAILURE_404
                </motion.div>
            </motion.div>
        </div>
    );
}
