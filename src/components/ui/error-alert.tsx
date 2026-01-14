import { AlertTriangle, AlertCircle, Info, XCircle } from "lucide-react";
import { cn } from "~/lib/utils";

type AlertType = "error" | "warning" | "info" | "success";

interface ErrorAlertProps {
    type?: AlertType;
    title?: string;
    message: string;
    className?: string;
}

const alertConfig = {
    error: {
        icon: XCircle,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        iconColor: "text-red-400",
        titleColor: "text-red-300",
    },
    warning: {
        icon: AlertTriangle,
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
        iconColor: "text-yellow-400",
        titleColor: "text-yellow-300",
    },
    info: {
        icon: Info,
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        iconColor: "text-blue-400",
        titleColor: "text-blue-300",
    },
    success: {
        icon: AlertCircle,
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        iconColor: "text-green-400",
        titleColor: "text-green-300",
    },
};

export function ErrorAlert({
    type = "error",
    title,
    message,
    className,
}: ErrorAlertProps) {
    const config = alertConfig[type];
    const Icon = config.icon;

    return (
        <div
            className={cn(
                "flex items-start gap-3 p-4 rounded-lg border",
                config.bgColor,
                config.borderColor,
                className
            )}
        >
            <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", config.iconColor)} />
            <div>
                {title && (
                    <h4 className={cn("font-medium mb-1", config.titleColor)}>{title}</h4>
                )}
                <p className="text-slate-400 text-sm">{message}</p>
            </div>
        </div>
    );
}

interface InlineErrorProps {
    message: string;
    className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
    return (
        <p className={cn("text-red-400 text-sm flex items-center gap-1", className)}>
            <XCircle className="w-3.5 h-3.5" />
            {message}
        </p>
    );
}

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-12 px-4 text-center",
                className
            )}
        >
            {icon && (
                <div className="p-4 rounded-full bg-slate-800/50 border border-slate-700 mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
            {description && (
                <p className="text-slate-400 text-sm max-w-sm mb-4">{description}</p>
            )}
            {action}
        </div>
    );
}
