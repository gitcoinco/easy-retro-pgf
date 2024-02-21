import clsx from "clsx";
import Link from "next/link";
import { XIcon } from "lucide-react";

import { InfiniteLoading } from "~/components/InfiniteLoading";
import { Button } from "~/components/ui/Button";
import { useSearchProjects } from "../hooks/useProjects";
import { useSelectProjects } from "../hooks/useSelectProjects";
import { ProjectSelectButton } from "./ProjectSelectButton";
import { getAppState } from "~/utils/state";
import { useResults } from "~/hooks/useResults";
import { SortFilter } from "~/components/SortFilter";
import { useFilter } from "~/features/filter/hooks/useFilter";
import { ProjectItem, ProjectItemAwarded } from "./ProjectItem";

export function Projects() {
  const projects = useSearchProjects();
  const select = useSelectProjects();
  const results = useResults();
  const { data: filter } = useFilter("projects");
  const appState = getAppState();

  return (
    <div>
      <div
        className={clsx(
          "sticky top-4 z-20 mb-4 mt-4 flex justify-end gap-4 lg:-mt-8",
          {
            ["invisible"]: !select.count,
          },
        )}
      >
        <Button
          variant="primary"
          onClick={select.add}
          disabled={!select.count}
          className="w-full lg:w-72"
        >
          Add {select.count} projects to ballot
        </Button>
        <Button size="icon" onClick={select.reset}>
          <XIcon />
        </Button>
      </div>

      <div className="flex justify-end">
        <SortFilter
          type="projects"
          sortOptions={["name_asc", "name_desc", "time_asc", "time_desc"]}
          filter={filter!}
        />
      </div>
      <InfiniteLoading
        {...projects}
        renderItem={(item, { isLoading }) => {
          return (
            <Link
              key={item.id}
              href={`/projects/${item.id}`}
              className={clsx("relative", { ["animate-pulse"]: isLoading })}
            >
              {!isLoading && appState === "VOTING" ? (
                <div className="absolute right-2 top-[100px] z-10 -mt-2">
                  <ProjectSelectButton
                    state={select.getState(item.id)}
                    onClick={(e) => {
                      e.preventDefault();
                      select.toggle(item.id);
                    }}
                  />
                </div>
              ) : null}
              {!results.isLoading && appState === "RESULTS" ? (
                <ProjectItemAwarded
                  amount={results.data?.projects?.[item.id]}
                />
              ) : null}
              <ProjectItem isLoading={isLoading} attestation={item} />
            </Link>
          );
        }}
      />
    </div>
  );
}
