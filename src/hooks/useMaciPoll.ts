import { getPoll, type Signer, type IGetPollData } from "maci-cli/sdk";
import { useEffect, useMemo, useState } from "react";

import { config } from "~/config";
import { useEthersSigner } from "./useEthersSigner";

export interface IUseMaciPollData {
  isLoading: boolean;
  votingEndsAt: Date;
  pollData?: IGetPollData;
}

export const useMaciPoll = (): IUseMaciPollData => {
  const signer = useEthersSigner();
  const [isLoading, setIsLoading] = useState(false);
  const [pollData, setPollData] = useState<IGetPollData>();

  const votingEndsAt = useMemo(
    () =>
      pollData
        ? new Date(
            Number(pollData.deployTime) * 1000 +
              Number(pollData.duration) * 1000,
          )
        : new Date(),
    [pollData?.deployTime, pollData?.duration],
  );

  useEffect(() => {
    if (!signer) {
      return;
    }

    setIsLoading(true);
    getPoll({
      maciAddress: config.maciAddress!,
      signer: signer as unknown as Signer,
    })
      .then((data) => {
        setPollData(data);
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, [signer, setIsLoading, setPollData]);

  return {
    isLoading,
    votingEndsAt,
    pollData,
  };
};
