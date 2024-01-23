import { ResponsiveLine } from "@nivo/line";
import { formatNumber } from "~/utils/formatNumber";
import { suffixNumber } from "~/utils/suffixNumber";

export default function ResultsChart({ data }) {
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 30, right: 60, bottom: 60, left: 60 }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
      }}
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      yFormat={(v) => formatNumber(Number(v))}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
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
              <tspan>{suffixNumber(value)}</tspan>
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
              transform={`translate(${textX},${textY}) rotate(${-20})`}
            >
              <tspan>{value}</tspan>
            </text>
          </g>
        ),
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
    />
  );
}
