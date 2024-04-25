import { useMutation } from "@tanstack/react-query";
import { useBeforeUnload } from "react-use";
import { useAccount, useChainId, useSignTypedData } from "wagmi";
import type { Vote, Ballot } from "~/features/ballot/types";

import { ballotTypedData } from "~/utils/typedData";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { keccak256 } from "viem";
import { useMaci } from "~/contexts/Maci";

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

export function useLockBallot() {
  const lock = api.ballot.lock.useMutation();
  const unlock = api.ballot.unlock.useMutation();

  return { lock, unlock };
}

export function useAddToBallot() {
  const { data: ballot } = useBallot();
  const { mutate } = useSaveBallot();
  const { pollData } = useMaci();
  const pollId = pollData?.id.toString();

  return useMutation({
    mutationFn: async (votes: Vote[]) => {
      if (ballot) {
        return mutate(mergeBallot(ballot as unknown as Ballot, votes, pollId!));
      }
    },
  });
}

export function useRemoveFromBallot() {
  const { data: ballot } = useBallot();
  const { pollData } = useMaci();
  const pollId = pollData?.id.toString();

  const { mutate } = useSaveBallot();
  return useMutation({
    mutationFn: async (projectId: string) => {
      const votes = (ballot?.votes ?? []).filter(
        (v) => v.projectId !== projectId,
      );
      return mutate({ ...ballot, votes, pollId: pollId! });
    },
  });
}

export function useBallot() {
  const { address } = useAccount();
  const { data: session } = useSession();
  const { pollData } = useMaci();
  const pollId = pollData?.id.toString();

  return api.ballot.get.useQuery(
    { pollId: pollId! },
    {
      enabled: Boolean(address && session && pollData),
    },
  );
}

export function useSubmitBallot({
  onSuccess,
}: {
  onSuccess: () => Promise<void>;
}) {
  const chainId = useChainId();
  const { refetch } = useBallot();
  const { pollData } = useMaci();
  const pollId = pollData?.id.toString();
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

        return mutateAsync({ signature, message, chainId, pollId: pollId! });
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

function mergeBallot(ballot: Ballot, addedVotes: Vote[], pollId: string) {
  return {
    ...ballot,
    pollId,
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
