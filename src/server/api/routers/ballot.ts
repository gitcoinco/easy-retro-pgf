import { TRPCError } from "@trpc/server";
import { type Address, verifyTypedData, keccak256 } from "viem";
import { isAfter } from "date-fns";
import type { Ballot } from "@prisma/client";
import {
  type BallotPublish,
  BallotPublishSchema,
  BallotSchema,
  type Vote,
  // Ballot,
} from "~/features/ballot/types";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { ballotTypedData } from "~/utils/typedData";
import type { db } from "~/server/db";
import { config } from "~/config";
import { sumBallot } from "~/features/ballot/hooks/useBallot";
import { type Prisma } from "@prisma/client";
import { fetchApprovedVoter } from "~/utils/fetchAttestations";
import { getAppState } from "~/utils/state";

const defaultBallotSelect = {
  votes: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  signature: true,
} satisfies Prisma.BallotSelect;

export const ballotRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    const voterId = ctx.session.user.name!;
    return ctx.db.ballot
      .findUnique({ select: defaultBallotSelect, where: { voterId } })
      .then((ballot) => ({
        ...ballot,
        votes: (ballot?.votes as Vote[]) ?? [],
      }));
  }),
  save: protectedProcedure
    .input(BallotSchema)
    .mutation(async ({ input, ctx }) => {
      const voterId = ctx.session.user.name!;

      await verifyUnpublishedBallot(voterId, ctx.db);

      return ctx.db.ballot.upsert({
        select: defaultBallotSelect,
        where: { voterId },
        update: input,
        create: { voterId, ...input },
      });
    }),
  publish: protectedProcedure
    .input(BallotPublishSchema)
    .mutation(async ({ input, ctx }) => {
      const voterId = ctx.session.user.name!;

      if (isAfter(new Date(), config.votingEndsAt)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Voting has ended" });
      }

      const ballot = await verifyUnpublishedBallot(voterId, ctx.db);
      if (!ballot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ballot doesn't exist",
        });
      }

      if (!verifyBallotCount(ballot.votes as Vote[])) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Ballot must have a maximum of ${config.votingMaxTotal} votes and ${config.votingMaxProject} per project.`,
        });
      }

      if (!(await fetchApprovedVoter(voterId))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Voter is not approved",
        });
      }

      if (
        !(await verifyBallotHash(
          input.message.hashed_votes,
          ballot.votes as Vote[],
        ))
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Votes hash mismatch",
        });
      }
      const { signature } = input;
      if (!(await verifyBallotSignature({ ...input, address: voterId }))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Signature couldn't be verified",
        });
      }

      return ctx.db.ballot.update({
        where: { voterId },
        data: { publishedAt: new Date(), signature },
      });
    }),
  results: publicProcedure.query(async ({ ctx }) => {
    if (getAppState() !== "RESULTS") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Voting has not ended yet",
      });
    }

    const ballots = await ctx.db.ballot.findMany();
    const results = calculateResults(ballots);
    return results;
  }),
});

type BallotResults = {
  totalVotes: number;
  totalVoters: number;
  projects: Record<string, number>;
};
function calculateResults(ballots: Ballot[]): BallotResults {
  let totalVotes = 0;
  const projects = new Map<string, number>();

  ballots
    .filter((ballot) => ballot.publishedAt)
    .forEach((ballot) => {
      ballot.votes.forEach((vote) => {
        const rewards = projects.get((vote as Vote).projectId) ?? 0;
        projects.set((vote as Vote).projectId, rewards + (vote as Vote).amount);

        totalVotes += 1;
      });
    });

  return {
    totalVoters: ballots.length,
    totalVotes: totalVotes,
    projects: Object.fromEntries(projects),
  };
}

function verifyBallotCount(votes: Vote[]) {
  const sum = sumBallot(votes);
  const validVotes = votes.every(
    (vote) => vote.amount <= config.votingMaxProject,
  );
  return sum <= config.votingMaxTotal && validVotes;
}

async function verifyBallotHash(hashed_votes: string, votes: Vote[]) {
  return hashed_votes === keccak256(Buffer.from(JSON.stringify(votes)));
}
async function verifyUnpublishedBallot(voterId: string, { ballot }: typeof db) {
  const existing = await ballot.findUnique({
    select: defaultBallotSelect,
    where: { voterId },
  });

  // Can only be submitted once
  if (existing?.publishedAt) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Ballot already published",
    });
  }
  return existing;
}

async function verifyBallotSignature({
  address,
  signature,
  message,
  chainId,
}: { address: string } & BallotPublish) {
  return await verifyTypedData({
    ...ballotTypedData(chainId),
    address: address as Address,
    message,
    signature,
  });
}
