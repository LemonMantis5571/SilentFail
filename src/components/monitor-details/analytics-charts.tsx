"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";

export function AnalyticsChart({ data }: { data: any[] }) {
  const chartData = [...data].reverse().map(p => ({
    time: new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    latency: p.latency,
    status: "UP" // In future you can color code DOWN states
  }));

  return (
    <div className="w-full h-[350px]">
      <ChartContainer
        config={{
          latency: {
            label: "Latency",
            color: "hsl(var(--primary))",
          },
        }}
        className="h-full w-full"
      >
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillLatency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="time" 
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => `${value}ms`}
          />
          <ChartTooltip 
            cursor={{ stroke: "#1e293b" }}
            content={
                <ChartTooltipContent 
                    indicator="line" 
                    className="bg-[#020817] border-slate-800 text-slate-200"
                />
            } 
           />
          <Area
            dataKey="latency"
            type="monotone"
            fill="url(#fillLatency)"
            stroke="#10b981"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}