import type { BallotResults } from "~/utils/calculateResults";

type ChartPoint = { x: string; y: number };
type LineChartData = { id: string; data: ChartPoint[] };

export function generateResultsChartData(
  allProjectResults: { name: string; id: string }[],
  projectResults: { name: string; id: string }[],
  projects: BallotResults,
): {
  calculatedData: LineChartData[];
  actualData: LineChartData[];
} {
  const calculated = mapProjectResultsToChartPoints(
    projectResults,
    projects,
    15,
    (project) => project?.votes ?? 0,
  );

  const projectNamesMap = getProjectNamesMap(allProjectResults);

  const actual = getTopProjectsByVotes(projects, 15).map(
    ([id, { actualVotes }]) => ({
      x: projectNamesMap[id] ?? "",
      y: actualVotes,
    }),
  );

  return {
    calculatedData: [{ id: "awarded", data: calculated }],
    actualData: [{ id: "awarded", data: actual }],
  };
}

const getProjectNamesMap = (
  projects: { name: string; id: string }[],
): Record<string, string> =>
  projects.reduce<Record<string, string>>((acc, { name, id }) => {
    acc[id] = name;
    return acc;
  }, {});

const mapProjectResultsToChartPoints = (
  results: { name: string; id: string }[],
  data: BallotResults,
  limit: number,
  getVotes: (project?: {
    voters: number;
    votes: number;
    actualVotes: number;
  }) => number,
): ChartPoint[] =>
  results.slice(0, limit).map((project) => ({
    x: project.name,
    y: getVotes(data[project.id]),
  }));

const getTopProjectsByVotes = (
  data: BallotResults,
  limit: number,
): [string, BallotResults[string]][] =>
  Object.entries(data)
    .sort((a, b) => b[1].actualVotes - a[1].actualVotes)
    .slice(0, limit);
