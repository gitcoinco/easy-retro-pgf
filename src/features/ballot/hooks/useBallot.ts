import { useMutation } from "@tanstack/react-query";
import { useBeforeUnload } from "react-use";
import { useAccount, useChainId, useSignTypedData } from "wagmi";
import type { Vote, Ballot } from "~/features/ballot/types";

import { ballotTypedData } from "~/utils/typedData";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { keccak256 } from "viem";

export function useSaveBallot(opts?: { onSuccess?: () => void }) {
  const utils = api.useUtils();

  const save = api.ballot.save.useMutation({
    onSuccess: () => {
      // Refetch the ballot to update the UI
      utils.ballot.invalidate().catch(console.log);
      opts?.onSuccess?.();
    },
  });
  useBeforeUnload(save.isPending, "You have unsaved changes, are you sure?");

  return save;
}

export function useAddToBallot() {
  const { data: ballot } = useBallot();
  const { mutateAsync } = useSaveBallot();

  return useMutation({
    mutationFn: async (votes: Vote[]) => {
      if (ballot) {
        return mutateAsync(mergeBallot(ballot as unknown as Ballot, votes));
      }
    },
  });
}

export function useRemoveFromBallot() {
  const { data: ballot } = useBallot();
  const { mutateAsync } = useSaveBallot();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const votes = (ballot?.votes ?? []).filter(
        (v) => v.projectId !== projectId,
      );
      return mutateAsync({ ...ballot, votes });
    },
  });
}

export function useBallot() {
  const { address } = useAccount();
  const { data: session } = useSession();
  return api.ballot.get.useQuery(undefined, {
    enabled: Boolean(address && session),
  });
}

export function useSubmitBallot({
  onSuccess,
}: {
  onSuccess: () => Promise<void>;
}) {
  const chainId = useChainId();
  const { refetch } = useBallot();

  const { mutateAsync, isPending } = api.ballot.publish.useMutation({
    onSuccess,
  });
  useBeforeUnload(isPending, "You have unsaved changes, are you sure?");

  const { signTypedDataAsync } = useSignTypedData();

  return useMutation({
    mutationFn: async () => {
      if (chainId) {
        const { data: ballot } = await refetch();

        const message = {
          total_votes: BigInt(sumBallot(ballot?.votes)),
          project_count: BigInt(ballot?.votes?.length ?? 0),
          hashed_votes: keccak256(Buffer.from(JSON.stringify(ballot?.votes))),
        };
        const signature = await signTypedDataAsync({
          ...ballotTypedData(chainId),
          message,
        });

        return mutateAsync({ signature, message, chainId });
      }
    },
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
