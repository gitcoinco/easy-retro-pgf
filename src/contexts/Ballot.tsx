import React, { createContext, useContext, useState, useEffect } from "react";

import type { BallotContextType, BallotProviderProps } from "./types";
import type { Ballot, Vote } from "~/features/ballot/types";
import { useAccount } from "wagmi";

export const BallotContext = createContext<BallotContextType | undefined>(
  undefined,
);

const defaultBallot = { votes: [], published: false };

export const BallotProvider: React.FC<BallotProviderProps> = ({ children }) => {
  const [ballot, setBallot] = useState<Ballot>(defaultBallot);

  const { isDisconnected } = useAccount();

  const sumBallot = (votes?: Vote[]) =>
    (votes ?? []).reduce(
      (sum, x) => sum + (!isNaN(Number(x?.amount)) ? Number(x.amount) : 0),
      0,
    );

  const ballotContains = (id: string) => {
    return ballot.votes.find((v) => v.projectId === id);
  };

  const toObject = (arr: object[] = [], key: string) => {
    return arr.reduce(
      (acc, x) => ({ ...acc, [x[key as keyof typeof acc]]: x }),
      {},
    );
  };

  const mergeBallot = (addedVotes: Vote[], pollId: string) => {
    return {
      ...ballot,
      pollId,
      votes: Object.values<Vote>({
        ...toObject(ballot.votes, "projectId"),
        ...toObject(addedVotes, "projectId"),
      }),
    };
  };

  // save the ballot to localstorage
  const saveBallot = () => {
    localStorage.setItem("ballot", JSON.stringify(ballot));
  };

  // remove certain project from the ballot
  const removeFromBallot = (projectId: string) => {
    const votes = (ballot?.votes ?? []).filter(
      (v) => v.projectId !== projectId,
    );

    setBallot({ ...ballot, votes, published: false });
  };

  // add to the ballot
  const addToBallot = (votes: Vote[], pollId?: string) => {
    if (!pollId) throw new Error("PollId is not provided.");

    setBallot(mergeBallot(votes, pollId));
  };

  // remove the ballot from localstorage
  const deleteBallot = () => {
    setBallot(defaultBallot);
    localStorage.removeItem("ballot");
  };

  // set published to tru
  const publishBallot = () => {
    setBallot({ ...ballot, published: true });
  };

  /// Read existing ballot in localStorage
  useEffect(() => {
    setBallot(
      JSON.parse(
        localStorage.getItem("ballot") ?? JSON.stringify(defaultBallot),
      ) ?? defaultBallot,
    );
  }, []);

  /// store ballot to localStorage once it changes
  useEffect(() => {
    if (ballot !== defaultBallot) {
      saveBallot();
    }
  }, [ballot, ballot.votes, ballot.published]);

  useEffect(() => {
    if (isDisconnected) {
      deleteBallot();
    }
  }, [isDisconnected]);

  const value: BallotContextType = {
    ballot,
    addToBallot,
    removeFromBallot,
    deleteBallot,
    ballotContains,
    sumBallot,
    publishBallot,
  };

  return (
    <BallotContext.Provider value={value}>{children}</BallotContext.Provider>
  );
};

export const useBallot = (): BallotContextType => {
  const context = useContext(BallotContext);

  if (!context) {
    throw new Error("Should use context inside provider.");
  }

  return context;
};
