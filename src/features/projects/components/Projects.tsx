import clsx from "clsx";
import Link from "next/link";
import { XIcon } from "lucide-react";

import { Alert } from "~/components/ui/Alert";
import { InfiniteLoading } from "~/components/InfiniteLoading";
import { Button } from "~/components/ui/Button";
import { useSearchProjects } from "../hooks/useProjects";
import { useSelectProjects } from "../hooks/useSelectProjects";
import { ProjectSelectButton } from "./ProjectSelectButton";
import { config } from "~/config";
import { getAppState } from "~/utils/state";
import { EAppState } from "~/utils/types";
import { useResults } from "~/hooks/useResults";
import { SortFilter } from "~/components/SortFilter";
import { ProjectItem, ProjectItemAwarded } from "./ProjectItem";
import { useMaci } from "~/contexts/Maci";

export function Projects() {
  const projects = useSearchProjects();
  const select = useSelectProjects();
  const appState = getAppState();
  const { isRegistered, pollData } = useMaci();
  const results = useResults(pollData);

  return (
    <div>
      {select.count > config.voteLimit && (
        <Alert variant="warning">
          You have exceeded your vote limit. You can only vote for{" "}
          {config.voteLimit} options.
        </Alert>
      )}

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
          disabled={!select.count || select.count > config.voteLimit}
          className="w-full lg:w-72"
        >
          Add {select.count} projects to ballot
        </Button>
        <Button size="icon" onClick={select.reset}>
          <XIcon />
        </Button>
      </div>

      <div className="flex justify-end">
        <SortFilter />
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
              {isRegistered && !isLoading && appState === EAppState.VOTING ? (
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
    </div>
  );
}
