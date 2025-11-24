"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "~/components/ui/chart";

export function MonitorSparkline({ data, status }: { data: any[], status: string }) {

    const chartData = data.length > 0
        ? [...data].reverse().map(p => ({ latency: p.latency, time: p.createdAt }))
        : Array(10).fill({ latency: 0 });


    const strokeColor = status === "UP" ? "#10b981" : "#f43f5e";

    return (
        <div className="h-[60px] w-full mt-4">
            <ChartContainer
                config={{
                    latency: {
                        label: "Latency (ms)",
                        color: strokeColor,
                    },
                }}
                className="h-full w-full"
            >
                <LineChart data={chartData}>
                    {/* Minimal Tooltip on Hover */}
                    <ChartTooltip
                        content={({ active, payload }) => {
                            if (!active || !payload || !payload.length) return null;
                            return (
                                <div className="rounded-lg border border-slate-800 bg-[#020817] p-2 text-xs shadow-xl">
                                    <span className="text-slate-400">Latency: </span>
                                    <span className="font-mono font-bold text-white">
                                        {payload[0]?.value}ms
                                    </span>
                                </div>
                            )
                        }}
                    />
                    {/* The Line Itself */}
                    <Line
                        type="monotone"
                        dataKey="latency"
                        stroke={strokeColor}
                        strokeWidth={2}
                        dot={false} // No dots = cleaner look
                        activeDot={{ r: 4, fill: strokeColor }}
                    />
                </LineChart>
            </ChartContainer>
        </div>
    );
}