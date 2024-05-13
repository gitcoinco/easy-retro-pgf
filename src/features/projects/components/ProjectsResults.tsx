import clsx from "clsx";
import Link from "next/link";

import { InfiniteLoading } from "~/components/InfiniteLoading";
import { getAppState } from "~/utils/state";
import { EAppState } from "~/utils/types";
import { useResults, useProjectsResults } from "~/hooks/useResults";
import { useMaci } from "~/contexts/Maci";
import { ProjectItem, ProjectItemAwarded } from "./ProjectItem";

export function ProjectsResults() {
  const { pollData } = useMaci();
  const projects = useProjectsResults(pollData);
  const results = useResults();
  const appState = getAppState();

  return (
    <InfiniteLoading
      {...projects}
      renderItem={(item, { isLoading }) => {
        return (
          <Link
            key={item.id}
            href={`/projects/${item.id}`}
            className={clsx("relative", { ["animate-pulse"]: isLoading })}
          >
            {!results.isLoading && appState === EAppState.RESULTS ? (
              <ProjectItemAwarded
                amount={results.data?.projects?.[item.id]?.votes}
              />
            ) : null}
            <ProjectItem isLoading={isLoading} attestation={item} />
          </Link>
        );
      }}
    />
  );
}
