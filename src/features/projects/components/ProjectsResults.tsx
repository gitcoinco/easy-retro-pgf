import clsx from "clsx";
import Link from "next/link";

import { ProjectsLoading } from "~/components/ProjectsLoading";
import { getAppState } from "~/utils/state";
import { useProjectsResults, useResults } from "~/hooks/useResults";
import { ProjectItem, ProjectItemAwarded } from "./ProjectItem";
import { Attestation } from "@ethereum-attestation-service/eas-sdk";

export function ProjectsResults() {
  const projects = useProjectsResults();
  const results = useResults();

  const data = projects.data ?? [];

  return (
    <ProjectsLoading
      data={data as Attestation[]} // Pass the flattened array here
      isLoading={projects.isLoading}
      renderItem={(item: any, { isLoading }) => {
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
