"use client";
import dynamic from "next/dynamic";
import { LineChart, Line, CartesianGrid, YAxis } from "recharts";

export function DistributionChart({
  data,
  formatChartTick = (v: number) => String(v),
}: {
  data: { x: number; y: number }[];
  formatChartTick: (alloc: number) => string;
}) {
  return (
    <LineChart
      width={250}
      height={128}
      data={
        data?.length
          ? data
          : [
              { x: 0, y: 0 },
              { x: 1, y: 0 },
            ]
      }
      margin={{ top: 16, right: 16, left: 16, bottom: 16 }}
    >
      <YAxis
        width={30}
        tickMargin={8}
        includeHidden
        axisLine={false}
        tickLine={false}
        tickSize={2}
        fontSize={10}
        tickFormatter={formatChartTick}
        padding={{ top: 0, bottom: 0 }}
      />
      <CartesianGrid
        horizontalValues={[0.2, 0.15, 0.1, 0.05, 0.0]}
        vertical={false}
        strokeDasharray="4"
      />
      <Line
        dot={(p) => {
          const { key, r, cx, cy } = p;
          return p.index === 0 ? (
            <circle key={key} r={r} cx={cx} cy={cy} fill="rgb(22,163,74)" />
          ) : (
            <path key={key} />
          );
        }}
        type="monotone"
        dataKey="y"
        stroke="rgb(22,163,74)"
      />
    </LineChart>
  );
}

export default dynamic(async () => DistributionChart, { ssr: false });
