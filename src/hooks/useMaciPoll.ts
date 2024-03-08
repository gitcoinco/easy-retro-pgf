import { getPoll, type TallyData, type IGetPollData } from "maci-cli/sdk";
import { useEffect, useMemo, useState } from "react";

import { config } from "~/config";
import { useEthersSigner } from "./useEthersSigner";
import { isAfter } from "date-fns";

export interface IUseMaciPollData {
  isLoading: boolean;
  votingEndsAt: Date;
  pollData?: IGetPollData;
  tallyData?: TallyData;
}

export const useMaciPoll = (): IUseMaciPollData => {
  const signer = useEthersSigner();
  const [isLoading, setIsLoading] = useState(false);
  const [pollData, setPollData] = useState<IGetPollData>();
  const [tallyData, setTallyData] = useState<TallyData>();

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
    Promise.all([
      getPoll({
        maciAddress: config.maciAddress!,
        signer,
      })
        .then((data) => {
          setPollData(data);
          return data;
        })
        .then(async (data) => {
          if (!data.isStateAqMerged || isAfter(votingEndsAt, new Date())) {
            return;
          }

          return fetch(`${config.tallyUrl}/tally-${data.id}.json`)
            .then((res) => res.json() as Promise<TallyData>)
            .then((res) => {
              setTallyData(res);
            })
            .catch(() => undefined);
        }),
    ])
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, [signer, votingEndsAt, setIsLoading, setTallyData, setPollData]);

  return {
    isLoading,
    votingEndsAt,
    pollData,
    tallyData,
  };
};
