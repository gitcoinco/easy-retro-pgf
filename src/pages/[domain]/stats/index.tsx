import { differenceInDays } from "date-fns";
import dynamic from "next/dynamic";
import { useMemo, type PropsWithChildren } from "react";
import { Alert } from "~/components/ui/Alert";
import { Heading } from "~/components/ui/Heading";
import { config } from "~/config";
import { useProjectCount } from "~/features/projects/hooks/useProjects";
import { useIsShowActualVotes } from "~/features/rounds/hooks/useIsShowActualVotes";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";
import { generateResultsChartData } from "~/features/stats/utils/generateResultsChartData";
import {
  useAllProjectsResults,
  useProjectsResults,
  useResults,
} from "~/hooks/useResults";
import { Layout } from "~/layouts/DefaultLayout";
import type { BallotResults } from "~/utils/calculateResults";

const ResultsChart = dynamic(
  async () => await import("~/features/results/components/Chart"),
  { ssr: false },
);

export default function StatsPage() {
  const round = useCurrentRound();
  return (
    <Layout>
      <Heading as="h1" size="3xl">
        Stats
      </Heading>

      {useRoundState() === "RESULTS" ? (
        <Stats />
      ) : (
        <Alert variant="info" className="mx-auto max-w-sm text-center">
          The results will be revealed in{" "}
          <div className="text-3xl">
            {differenceInDays(round.data?.resultAt, new Date())}
          </div>
          days
        </Alert>
      )}
    </Layout>
  );
}

function Stats() {
  const results = useResults();
  const count = useProjectCount();
  const { data: projectsResults } = useProjectsResults();
  const { data: allProjectsResults } = useAllProjectsResults();
  const isShowActualVotes = useIsShowActualVotes();

  const {
    averageVotes,
    totalVotes,
    totalVoters,
    projects = {},
    actualTotalVotes,
  } = results.data ?? {};

  const { actualData, calculatedData } = useMemo(
    () =>
      generateResultsChartData(
        (allProjectsResults ?? []) as { name: string; id: string }[],
        (projectsResults?.pages?.[0] ?? []) as { name: string; id: string }[],
        projects as BallotResults,
      ),
    [projects, projectsResults],
  );

  return (
    <div>
      <h3 className="text-lg font-bold">Top Projects</h3>
      <div className="mb-8 h-[400px] rounded-xl bg-white text-black">
        <ResultsChart data={isShowActualVotes ? actualData : calculatedData} />
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        <Stat title="Projects applied">{count.data?.count}</Stat>
        <Stat title="Projects voted for">{Object.keys(projects).length}</Stat>
        <Stat title="Votes">
          {isShowActualVotes ? actualTotalVotes : totalVotes}
        </Stat>
        <Stat title="People Voting">{totalVoters}</Stat>
        {/* <Stat title="Average votes per project">
          {formatNumber(averageVotes)}
        </Stat> */}
      </div>
    </div>
  );
}
function Stat({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="rounded border p-2 dark:border-gray-700">
      <h3 className="font-bold text-gray-500">{title}</h3>
      <div className="text-4xl">{children}</div>
    </div>
  );
}
