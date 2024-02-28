import { publishBatch, type Signer } from "maci-cli/sdk";
import { useCallback, useState } from "react";

import { config } from "~/config";
import { useEthersSigner } from "./useEthersSigner";
import { useSession } from "next-auth/react";
import { useMaciSignup } from "./useMaciSignup";
import { useMaciPoll } from "./useMaciPoll";

export interface IVoteArgs {
  voteOptionIndex: bigint;
  newVoteWeight: bigint;
}

export interface IUseMaciVoteData {
  isLoading: boolean;
  pollId?: string;
  error?: string;
  onVote: (
    args: IVoteArgs[],
    onError: () => Promise<void>,
    onSuccess: () => Promise<void>,
  ) => Promise<void>;
}

export const useMaciVote = (nonce = 0): IUseMaciVoteData => {
  const signer = useEthersSigner();
  const { data } = useSession();
  const { stateIndex } = useMaciSignup();
  const { pollData } = useMaciPoll();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onVote = useCallback(
    async (
      votes: IVoteArgs[],
      onError: () => Promise<void>,
      onSuccess: () => Promise<void>,
    ) => {
      if (!signer || !data || !stateIndex || !pollData) {
        return;
      }

      if (!votes.length) {
        await onError();
        setError("No votes provided");
        return;
      }

      const messages = votes.map(
        ({ newVoteWeight, voteOptionIndex }, index) => ({
          newVoteWeight,
          voteOptionIndex,
          stateIndex: BigInt(stateIndex),
          maciContractAddress: config.maciAddress!,
          nonce: BigInt(nonce + index + 1),
        }),
      );

      setIsLoading(true);
      await publishBatch({
        messages,
        maciContractAddress: config.maciAddress!,
        publicKey: data.publicKey,
        privateKey: data.privateKey,
        pollId: BigInt(pollData.id),
        signer: signer as unknown as Signer,
      })
        .then(() => onSuccess())
        .catch((error: Error) => {
          setError(error.message);
          return onError();
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [
      nonce,
      stateIndex,
      pollData?.id,
      data?.publicKey,
      data?.privateKey,
      signer,
      setIsLoading,
      setError,
    ],
  );

  return {
    isLoading,
    pollId: pollData?.id.toString(),
    error,
    onVote,
  };
};