import clsx from "clsx";
import Link from "next/link";

import { InfiniteLoading } from "~/components/InfiniteLoading";
import { getAppState } from "~/utils/state";
import { useResults, useProjectsResults } from "~/hooks/useResults";
import { ProjectItem, ProjectItemAwarded } from "./ProjectItem";

export function ProjectsResults() {
  const projects = useProjectsResults();
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
            {!results.isLoading && appState === "RESULTS" ? (
              <ProjectItemAwarded amount={results.data?.projects?.[item.id]} />
            ) : null}
            <ProjectItem isLoading={isLoading} attestation={item} />
          </Link>
        );
      }}
    />
  );
}
