import { useMutation } from "@tanstack/react-query";
import { useBeforeUnload } from "react-use";
import { useAccount, useNetwork, useSignTypedData } from "wagmi";
import type { Vote, Ballot } from "~/features/ballot/types";

import { ballotTypedData } from "~/utils/typedData";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { keccak256 } from "viem";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";

export function useSaveBallot(opts?: { onSuccess?: () => void }) {
  const utils = api.useUtils();

  const save = api.ballot.save.useMutation({
    onSuccess: () => {
      // Refetch the ballot to update the UI
      utils.ballot.invalidate().catch(console.log);
      opts?.onSuccess?.();
    },
  });
  useBeforeUnload(save.isLoading, "You have unsaved changes, are you sure?");

  return save;
}

export function useAddToBallot() {
  const { data: ballot } = useBallot();
  const { mutate } = useSaveBallot();

  return useMutation(async (votes: Vote[]) => {
    if (ballot) {
      return mutate(mergeBallot(ballot as unknown as Ballot, votes));
    }
  });
}

export function useRemoveFromBallot() {
  const { data: ballot } = useBallot();
  const { data: round } = useCurrentRound();
  const roundId = String(round?.id);

  const { mutate } = useSaveBallot();
  return useMutation(async (projectId: string) => {
    const votes = (ballot?.votes ?? []).filter(
      (v) => v.projectId !== projectId,
    );
    return mutate({ ...ballot, votes, roundId });
  });
}

export function useBallot() {
  const { data: round } = useCurrentRound();
  const roundId = String(round?.id);
  const { address } = useAccount();
  const { data: session } = useSession();

  return api.ballot.get.useQuery(
    { roundId },
    { enabled: Boolean(address && session && roundId) },
  );
}

export function useSubmitBallot({
  onSuccess,
}: {
  onSuccess: () => Promise<void>;
}) {
  const { chain } = useNetwork();
  const { refetch } = useBallot();
  const { data: round } = useCurrentRound();
  const roundId = String(round?.id);

  const { mutateAsync, isLoading } = api.ballot.publish.useMutation({
    onSuccess,
  });
  useBeforeUnload(isLoading, "You have unsaved changes, are you sure?");

  const { signTypedDataAsync } = useSignTypedData();

  return useMutation(async () => {
    if (!chain) throw new Error("No connected network found");

    const { data: ballot } = await refetch();
    const message = {
      total_votes: BigInt(sumBallot(ballot?.votes)),
      project_count: BigInt(ballot?.votes?.length ?? 0),
      hashed_votes: keccak256(Buffer.from(JSON.stringify(ballot?.votes))),
    };
    const signature = await signTypedDataAsync({
      ...ballotTypedData(chain?.id),
      message,
    });

    return mutateAsync({ signature, message, chainId: chain.id, roundId });
  });
}

export const sumBallot = (votes?: Vote[]) =>
  (votes ?? []).reduce(
    (sum, x) => sum + (!isNaN(Number(x?.amount)) ? Number(x.amount) : 0),
    0,
  );

export function ballotContains(id: string, ballot?: Ballot) {
  return ballot?.votes.find((v) => v.projectId === id);
}

function mergeBallot(ballot: Ballot, addedVotes: Vote[]) {
  return {
    ...ballot,
    votes: Object.values<Vote>({
      ...toObject(ballot?.votes, "projectId"),
      ...toObject(addedVotes, "projectId"),
    }),
  };
}

function toObject(arr: object[] = [], key: string) {
  return arr?.reduce(
    (acc, x) => ({ ...acc, [x[key as keyof typeof acc]]: x }),
    {},
  );
}
