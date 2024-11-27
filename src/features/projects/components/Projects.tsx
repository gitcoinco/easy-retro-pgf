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

export function Projects() {
  const projects = useSearchProjects();
  const select = useSelectProjects();
  const results = useResults();
  const domain = useCurrentDomain();

  const isShowActualVotes = useIsShowActualVotes();

  const roundState = useRoundState();
  return (
    <div>
      <div
        className={clsx(
          "relative mb-[8px] md:mb-auto md:bottom-auto md:float-right md:mr-[-320px] md:top-[20rem] rounded-bl-3xl md:mt-[8px] flex",
          {
            ["hidden"]: !select.count,
          },
        )}
      >
        <Button
          variant="secondary"
          onClick={select.add}
          disabled={!select.count}
          className="w-full mr-[4px] md:w-[248px] height-[48px] md:mr-[8px]"
        >
          Add {select.count} projects to ballot
        </Button>
        <Button icon={XIcon} className="w-[48px] height-[48px]" onClick={select.reset} />
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
