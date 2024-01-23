import { differenceInDays, formatRelative } from "date-fns";
import { type PropsWithChildren } from "react";
import { Alert } from "~/components/ui/Alert";
import { Heading } from "~/components/ui/Heading";
import { config } from "~/config";
import { useProjectCount, useResults } from "~/hooks/useResults";
import { Layout } from "~/layouts/DefaultLayout";
import { formatNumber } from "~/utils/formatNumber";
import { getAppState } from "~/utils/state";

export default function StatsPage() {
  return (
    <Layout>
      <Heading as="h1" size="3xl">
        Stats
      </Heading>

      {getAppState() === "RESULTS" ? (
        <Stats />
      ) : (
        <Alert variant="info" className="mx-auto max-w-sm text-center">
          The results will be revealed in{" "}
          <div className="text-3xl">
            {differenceInDays(config.resultsAt, new Date())}
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

  const {
    averageVotes,
    totalVotes,
    totalVoters,
    projects = {},
  } = results.data ?? {};

  return (
    <div className="grid gap-2 md:grid-cols-3">
      <Stat title="Projects applied">{count.data?.count}</Stat>
      <Stat title="Projects voted for">{Object.keys(projects).length}</Stat>
      <Stat title="Votes">{totalVotes}</Stat>
      <Stat title="People Voting">{totalVoters}</Stat>
      <Stat title="Average votes per project">
        {formatNumber(averageVotes)}
      </Stat>
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
