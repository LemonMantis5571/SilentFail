"use client";

import { Line, LineChart } from "recharts";
import { ChartContainer, ChartTooltip } from "~/components/ui/chart";
import { type MonitorWithPings } from "~/app/actions/monitor";

type PingPoint = MonitorWithPings["pings"][number];
type SparklinePoint = {
  latency: number;
  time?: PingPoint["createdAt"];
  sequence: number;
};

function getSparklinePayload(
  payload: unknown,
): Partial<SparklinePoint> | undefined {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  return payload as Partial<SparklinePoint>;
}

export function MonitorSparkline({ data, status }: { data: PingPoint[], status: string }) {

  const strokeColor = status === "UP" ? "#10b981" : "#f43f5e";


  const chartData: SparklinePoint[] = data.length > 0
    ? [...data].reverse().map((p, i) => {
      return {
        latency: p.latency,
        time: p.createdAt,
        sequence: i + 1
      }
    })
    : Array.from({ length: 10 }, (_, index) => ({
      latency: 0,
      sequence: index + 1,
    }));

  return (
    <div className="h-[60px] w-full mt-4">
      <ChartContainer
        config={{
          latency: {
            label: "Observed Interval (s)",
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
              if (!active || !payload?.length) return null;

              const payloadData = getSparklinePayload(payload[0]?.payload);
              const rawTime = payloadData?.time;

              const formattedTime = rawTime?.toString()
                ? new Date(rawTime).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  })
                : 'N/A';

              return (
                <div className="rounded-lg border border-slate-800 bg-[#020817] p-2 text-xs shadow-xl">
                  <div className="text-slate-500 mb-1">
                    Ping #{payloadData?.sequence ?? 'N/A'}
                  </div>

                  <div className="text-slate-500 mb-1">
                    <span className="text-slate-400">Time: </span>
                    <span className="font-mono font-bold text-white">
                      {formattedTime}
                    </span>
                  </div>

                  <span className="text-slate-400">Latency: </span>
                  <span className="font-mono font-bold text-white">
                    {typeof payload[0]?.value === "number" ? `${payload[0].value}s` : "N/A"}
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
