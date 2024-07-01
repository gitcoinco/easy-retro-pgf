"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { LineChart, Line, CartesianGrid, YAxis } from "recharts";

// Configuration constants
const lineChartConfig = {
  width: 250,
  height: 128,
  margin: { top: 16, right: 16, left: 16, bottom: 16 },
};

const yAxisConfig = {
  includeHidden: true,
  width: 30,
  tickMargin: 8,
  axisLine: false,
  tickLine: false,
  tickSize: 2,
  fontSize: 10,
  padding: { top: 0, bottom: 0 },
  tickFormatter: (p: number) => `${p * 100}%`,
};

const cartesianGridConfig = {
  horizontalValues: [0.2, 0.15, 0.1, 0.05, 0.0],
  vertical: false,
  strokeDasharray: "4",
};

const lineDot = (p: {
  index: number;
  key: string;
  r?: number;
  cx?: number;
  cy?: number;
}) => {
  const { key, r, cx, cy } = p;
  return p.index === 0 ? (
    <circle key={key} r={r} cx={cx} cy={cy} fill="red" />
  ) : (
    <path key={key} />
  );
};

type CustomLineChartProps = {
  data: { x: number; y: number }[];
};

export function CustomLineChart({ data }: CustomLineChartProps) {
  const lineChartData = useMemo(
    () =>
      data?.length
        ? data
        : [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
          ],
    [data],
  );

  return (
    <LineChart {...lineChartConfig} data={lineChartData}>
      <YAxis {...yAxisConfig} />
      <CartesianGrid {...cartesianGridConfig} />
      <Line dot={lineDot} type="monotone" dataKey="y" stroke="red" />
    </LineChart>
  );
}

export default dynamic(() => Promise.resolve(CustomLineChart), {
  ssr: false,
});
