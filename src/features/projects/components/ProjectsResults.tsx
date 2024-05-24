import clsx from "clsx";
import Link from "next/link";

import { InfiniteLoading } from "~/components/InfiniteLoading";
import { getAppState } from "~/utils/state";
import { useProjectsResults, useResults } from "~/hooks/useResults";
import { ProjectItem, ProjectItemAwarded } from "./ProjectItem";

export function ProjectsResults() {
  const projects = useProjectsResults();
  const results = useResults();

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
            {!results.isPending && getAppState() === "RESULTS" ? (
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
