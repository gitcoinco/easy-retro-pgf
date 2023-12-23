import { TRPCError } from "@trpc/server";
import { type Address, verifyTypedData } from "viem";
import { isAfter } from "date-fns";
import {
  type BallotPublish,
  BallotPublishSchema,
  BallotSchema,
  type Vote,
} from "~/features/ballot/types";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ballotTypedData } from "~/utils/typedData";
import type { db } from "~/server/db";
import { fetchApprovedVoter } from "~/utils/fetchApprovedVoter";
import { config } from "~/config";
import { sumBallot } from "~/features/ballot/hooks/useBallot";
import { type Prisma } from "@prisma/client";

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

      const { message, signature } = input;
      await verifyBallotSignature({ message, signature, address: voterId });

      return ctx.db.ballot.update({
        where: { voterId },
        data: { publishedAt: new Date(), signature },
      });
    }),
});

function verifyBallotCount(votes: Vote[]) {
  const sum = sumBallot(votes);
  const validVotes = votes.every(
    (vote) => vote.amount <= config.votingMaxProject,
  );
  return sum <= config.votingMaxTotal && validVotes;
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
}: { address: string } & BallotPublish) {
  const verified = await verifyTypedData({
    ...ballotTypedData,
    address: address as Address,
    message,
    signature,
  });

  if (!verified) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Signature couldn't be verified",
    });
  }
  return true;
}
