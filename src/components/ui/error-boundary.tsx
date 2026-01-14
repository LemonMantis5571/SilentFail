"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-red-500/5 border border-red-500/20">
                    <div className="p-3 rounded-full bg-red-500/10 mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Something went wrong
                    </h3>
                    <p className="text-slate-400 text-sm text-center mb-4 max-w-sm">
                        An unexpected error occurred. Please try again.
                    </p>
                    <Button
                        onClick={() => this.setState({ hasError: false, error: undefined })}
                        variant="ghost"
                        className="border border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
