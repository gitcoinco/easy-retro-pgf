import { useMutation } from "@tanstack/react-query";
import { useBeforeUnload } from "react-use";
import { useAccount, useSignTypedData } from "wagmi";
import type { Vote, Ballot } from "~/features/ballot/types";

import { ballotTypedData } from "~/utils/typedData";
import { api } from "~/utils/api";

export function useSaveBallot() {
  const utils = api.useUtils();

  const save = api.ballot.save.useMutation({
    // Refetch the ballot to update the UI
    onSuccess: () => utils.ballot.invalidate().catch(console.log),
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

  const { mutate } = useSaveBallot();
  return useMutation(async (projectId: string) => {
    const votes = (ballot?.votes ?? []).filter(
      (v) => v.projectId !== projectId,
    );
    return mutate({ ...ballot, votes });
  });
}

export function useBallot() {
  const { address } = useAccount();

  return api.ballot.get.useQuery(undefined, { enabled: Boolean(address) });
}

export function useSubmitBallot({
  onSuccess,
}: {
  onSuccess: () => Promise<void>;
}) {
  const { data: ballot } = useBallot();
  const { mutateAsync, isLoading } = api.ballot.publish.useMutation({
    onSuccess,
  });
  useBeforeUnload(isLoading, "You have unsaved changes, are you sure?");

  const message = {
    total_votes: BigInt(sumBallot(ballot?.votes)),
    project_count: BigInt(ballot?.votes?.length ?? 0),
  };
  const { signTypedDataAsync } = useSignTypedData({
    ...ballotTypedData,
    message,
  });
  return useMutation(async () => {
    // TODO: Sign typed message
    const signature = await signTypedDataAsync();
    return mutateAsync({ signature, message });
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
