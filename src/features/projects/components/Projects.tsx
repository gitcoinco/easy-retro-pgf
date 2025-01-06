"use client";

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
import { useIsShowActualVotes } from "~/features/rounds/hooks/useIsShowActualVotes";
import { useBallot } from "~/features/ballot/hooks/useBallot";

export function Projects() {
  const projects = useSearchProjects();
  const select = useSelectProjects();
  const results = useResults();
  const domain = useCurrentDomain();
  const { data: ballot } = useBallot();
  const allocations = ballot?.votes ?? [];

  const isShowActualVotes = useIsShowActualVotes();

  const roundState = useRoundState();
  return (
    <div>
      <div
        className={clsx(
          "relative mb-2 md:mb-auto md:bottom-auto md:float-right md:mr-[-20rem] md:top-80 rounded-bl-3xl md:mt-2 flex",
          {
            ["hidden"]: !select.count,
          },
        )}
      >
        <Button
          variant={allocations?.length ? "secondary" : "primary"}
          onClick={select.add}
          disabled={!select.count}
          className="w-full mr-1 md:w-[248px] h-12 md:mr-2"
        >
          Add {select.count} projects to ballot
        </Button>
        <Button icon={XIcon} className="size-12" onClick={select.reset} />
      </div>

      <SortFilter />
      <InfiniteLoading
        {...projects}
        renderItem={(item, { isLoading }: { isLoading: boolean }) => {
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
              {!results.isPending &&
              !results.error &&
              roundState === "RESULTS" ? (
                <ProjectItemAwarded
                  amount={
                    isShowActualVotes
                      ? results.data?.projects?.[item.id]?.actualVotes
                      : results.data?.projects?.[item.id]?.votes
                  }
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
