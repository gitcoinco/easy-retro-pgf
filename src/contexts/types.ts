import { type ReactNode } from "react";
import { type TallyData, type IGetPollData } from "maci-cli/sdk";
import type { Ballot, Vote } from "~/features/ballot/types";

export interface IVoteArgs {
  voteOptionIndex: bigint;
  newVoteWeight: bigint;
}

export interface MaciContextType {
  isLoading: boolean;
  isEligibleToVote: boolean;
  initialVoiceCredits: number;
  votingEndsAt: Date;
  stateIndex?: string;
  isRegistered?: boolean;
  pollId?: string;
  error?: string;
  pollData?: IGetPollData;
  tallyData?: TallyData;
  onSignup: (onError: () => void) => Promise<void>;
  onVote: (
    args: IVoteArgs[],
    onError: () => Promise<void>,
    onSuccess: () => Promise<void>,
  ) => Promise<void>;
}

export interface MaciProviderProps {
  children: ReactNode;
}

export interface BallotContextType {
  ballot?: Ballot;
  addToBallot: (votes: Vote[], pollId: string) => void;
  removeFromBallot: (projectId: string) => void;
  deleteBallot: () => void;
  ballotContains: (id: string, ballot?: Ballot) => Vote | undefined;
  sumBallot: (votes?: Vote[]) => number;
  publishBallot: () => void;
}

export interface BallotProviderProps {
  children: ReactNode;
}
