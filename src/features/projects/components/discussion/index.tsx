import React from "react";
import { useVoters } from "~/features/voters/components/VotersList";
import { type Attestation } from "~/utils/fetchAttestations";
import { type AppState } from "~/utils/state";
import { CreateNew } from "./CreateNew";
import { List } from "./list";
import { useGetDiscussions } from "../../hooks/useDiscussion";
import type { Discussion } from "~/features/projects/types/discussion";

export const DiscussionComponent = ({
  address,
  state,
  projectId,
}: {
  address: `0x${string}` | undefined;
  state: AppState;
  projectId: string;
}) => {
  const voters: Attestation[] = useVoters();
  const { data, refetch } = useGetDiscussions({ projectId: projectId });
  return (
    <div className="mt-10 flex flex-col items-baseline gap-5 border-t border-outlineVariant-dark pt-10">
      <div className=" text-lg font-bold text-onSurface-dark">Discussions</div>
      {state === "APPLICATION" ||
      voters?.some((item) => item.recipient === address) ? (
        <>
          <CreateNew onRefetch={() => refetch()} projectId={projectId} />
          {data && (
            <List
              projectId={projectId}
              discussions={data as Discussion[]}
              onRefetch={() => refetch()}
            />
          )}
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
