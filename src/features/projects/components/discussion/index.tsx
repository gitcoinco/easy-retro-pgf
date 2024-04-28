import React from "react";
import { useVoters } from "~/features/voters/components/VotersList";
import { type Attestation } from "~/utils/fetchAttestations";
import { type AppState } from "~/utils/state";
import { CreateNew } from "./CreateNew";
import { List } from "./List";

export type IdeaType = "Concern" | "Question" | "Strength";

export type Idea = {
  desc: string;
  type: IdeaType;
  isAnonymous: boolean;
};

export const Feedback = ({
  address,
  state,
}: {
  address: `0x${string}` | undefined;
  state: AppState;
}) => {
  const {
    data,
    isPending,
  }: { data: Attestation[] | undefined; isPending: boolean } = useVoters();

  return (
    <div className="mt-10 flex flex-col items-baseline gap-5 border-t border-outlineVariant-dark pt-10">
      <div className=" text-lg font-bold text-onSurface-dark">Discussions</div>
      {state === "APPLICATION" ||
      data?.some((item) => item.recipient === address) ? (
        <>
          <CreateNew />
          <List />
        </>
      ) : (
        <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-outlineVariant-dark bg-surfaceContainerLow-dark py-7 text-onSurfaceVariant-dark">
          <p className="text-base font-semibold">
            Creating project period is finished
          </p>
          <span className="text-xs font-normal">
            View discussions is only available for the voters
          </span>
        </div>
      )}
    </div>
  );
};
