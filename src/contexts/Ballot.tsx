import React, { createContext, useContext, useState, useEffect } from "react";

import type { BallotContextType, BallotProviderProps } from "./types";
import type { Ballot, Vote } from "~/features/ballot/types";

export const BallotContext = createContext<BallotContextType | undefined>(
  undefined,
);

export const BallotProvider: React.FC<BallotProviderProps> = ({ children }) => {
  const [ballot, setBallot] = useState<Ballot>({ votes: [], published: false });

  const sumBallot = (votes?: Vote[]) =>
    (votes ?? []).reduce(
      (sum, x) => sum + (!isNaN(Number(x?.amount)) ? Number(x.amount) : 0),
      0,
    );

  const ballotContains = (id: string, ballot?: Ballot) => {
    return ballot?.votes?.find((v) => v.projectId === id);
  };

  const toObject = (arr: object[] = [], key: string) => {
    return arr.reduce(
      (acc, x) => ({ ...acc, [x[key as keyof typeof acc]]: x }),
      {},
    );
  };

  const mergeBallot = (ballot: Ballot, addedVotes: Vote[], pollId: string) => {
    return {
      ...ballot,
      pollId,
      votes: Object.values<Vote>({
        ...toObject(ballot?.votes, "projectId"),
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
    console.log("ballot.votes:", ballot.votes);
    console.log("projectId:", projectId);
    setBallot({ ...ballot, votes, published: false });
    saveBallot();
  };

  // add to the ballot
  const addToBallot = (votes: Vote[], pollId?: string) => {
    if (!pollId) throw new Error("PollId is not provided.");

    setBallot(mergeBallot(ballot as unknown as Ballot, votes, pollId));
    saveBallot();
  };

  // remove the ballot from localstorage
  const deleteBallot = () => {
    setBallot({ votes: [], published: false });
    localStorage.removeItem("ballot");
  };

  /// Read existing ballot in localStorage
  useEffect(() => {
    setBallot(
      JSON.parse(localStorage.getItem("ballot") ?? "{}") ?? {
        votes: [],
        published: false,
      },
    );
  }, []);

  const value: BallotContextType = {
    ballot,
    addToBallot,
    removeFromBallot,
    deleteBallot,
    ballotContains,
    sumBallot,
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
