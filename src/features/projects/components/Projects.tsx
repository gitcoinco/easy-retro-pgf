import clsx from "clsx";
import Link from "next/link";
import { XIcon } from "lucide-react";

import { InfiniteLoading } from "~/components/InfiniteLoading";
import { Button } from "~/components/ui/Button";
import { useSearchProjects } from "../hooks/useProjects";
import { useSelectProjects } from "../hooks/useSelectProjects";
import { ProjectSelectButton } from "./ProjectSelectButton";
import { useRoundState } from "~/features/rounds/hooks/useRoundState";
import { useResults } from "~/hooks/useResults";
import { SortFilter } from "~/components/SortFilter";
import { ProjectItem, ProjectItemAwarded } from "./ProjectItem";
import { useCurrentDomain } from "~/features/rounds/hooks/useRound";

export function Projects() {
  const projects = useSearchProjects();
  const select = useSelectProjects();
  const results = useResults();
  const domain = useCurrentDomain();

  const roundState = useRoundState();
  return (
    <div>
      <div
        className={clsx(
          "fixed right-0 top-0 z-20 flex justify-end gap-2 rounded-bl-3xl bg-white px-2 pb-2 pt-4 dark:bg-gray-900",
          {
            ["invisible"]: !select.count,
          },
        )}
      >
        <Button
          size="sm"
          variant="primary"
          onClick={select.add}
          disabled={!select.count}
          className="w-full lg:w-72"
        >
          Add {select.count} projects to ballot
        </Button>
        <Button icon={XIcon} size="sm" onClick={select.reset} />
      </div>

      <SortFilter />
      <InfiniteLoading
        {...projects}
        renderItem={(item, { isLoading }) => {
          return (
            <Link
              key={item.id}
              href={`/${domain}/projects/${item.id}`}
              className={clsx("relative", { ["animate-pulse"]: isLoading })}
            >
              {!isLoading && roundState === "VOTING" ? (
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
              {!results.isPending && roundState === "RESULTS" ? (
                <ProjectItemAwarded
                  amount={results.data?.projects?.[item.id]?.votes}
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
