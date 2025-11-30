"use client";

import { Line, LineChart } from "recharts";
import { ChartContainer, ChartTooltip } from "~/components/ui/chart";

export function MonitorSparkline({ data, status }: { data: any[], status: string }) {

  const strokeColor = status === "UP" ? "#10b981" : "#f43f5e";

  console.log(data);
  const chartData = data.length > 0
    ? [...data].reverse().map((p, i) => {
      return {
        latency: p.latency,
        time: p.createdAt,
        sequence: i + 1
      }
    })
    : Array(10).fill({ latency: 0, sequence: 0 });

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
        <LineChart
          accessibilityLayer
          data={chartData}
        >
          {/* Minimal Tooltip on Hover */}
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;

              const rawTime = payload[0]?.payload.time;

              const formattedTime = rawTime
                ? new Date(rawTime).toLocaleString('es-ES', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                })
                : 'N/A'

              return (
                <div className="rounded-lg border border-slate-800 bg-[#020817] p-2 text-xs shadow-xl">
                  <div className="text-slate-500 mb-1">
                    Ping #{payload[0]?.payload.sequence}
                  </div>

                  <div className="text-slate-500 mb-1">
                    <span className="text-slate-400">Time: </span>
                    <span className="font-mono font-bold text-white">
                      {formattedTime}
                    </span>
                  </div>

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
            dataKey="latency"
            type="monotone"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: strokeColor }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}