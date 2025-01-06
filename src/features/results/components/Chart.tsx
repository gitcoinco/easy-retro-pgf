import { ResponsiveBar } from "@nivo/bar";
import { suffixNumber } from "~/utils/suffixNumber";

export default function ResultsChart({
  data,
}: {
  data: {
    id: string;
    data: { x: string; y: number | undefined }[];
  }[];
}) {
  // Transform data into the format required by ResponsiveBar
  const barData = data.map((dataset) =>
    dataset.data.map((point) => ({
      id: dataset.id,
      x: point.x,
      score: point.y || 0,
    }))
  ).flat();

  return (
    <ResponsiveBar
      data={barData}
      keys={["score"]}
      indexBy="x"
      margin={{ top: 30, right: 60, bottom: 60, left: 60 }}
      colors={() => `#2fe4ab`}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        legend: 'Score',
        tickRotation: 0,
        legendOffset: -40,
        legendPosition: "middle",
        renderTick: ({ textAnchor, textX, textY, value, x, y }) => (
          <g transform={`translate(${x},${y})`}>
            <text
              fontSize={10}
              textAnchor={textAnchor}
              transform={`translate(${textX},${textY})`}
            >
              <tspan>{suffixNumber(Number(value))}</tspan>
            </text>
          </g>
        ),
      }}
      axisBottom={{
        renderTick: ({ textAnchor, textX, textY, value, x, y }) => (
          <g transform={`translate(${x},${y})`}>
            <text
              fontSize={10}
              textAnchor={textAnchor}
              transform={`translate(${textX},${textY}) rotate(${0})`}
            >
              <tspan>{value}</tspan>
            </text>
          </g>
        ),
        tickPadding: 10,
      }}
      labelSkipWidth={0}
      labelSkipHeight={0}
      theme={{
        axis: {
            legend: {
                text: {
                    fontSize: 16,
                },
            },
        },
    }}
    />
);
}
