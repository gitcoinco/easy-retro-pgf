import { TRPCError } from "@trpc/server";
import { type Address, verifyTypedData, keccak256 } from "viem";
import {
  type BallotPublish,
  BallotPublishSchema,
  BallotSchema,
  type Vote,
} from "~/features/ballot/types";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ballotTypedData } from "~/utils/typedData";
import type { db } from "~/server/db";
import { config } from "~/config";
import { type Prisma } from "@prisma/client";
import { fetchApprovedVoter } from "~/utils/fetchAttestations";
import { z } from "zod";

const defaultBallotSelect = {
  pollId: true,
  maci: true,
  votes: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  signature: true,
} satisfies Prisma.BallotSelect;

export const ballotRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ pollId: z.string() }))
    .query(async ({ input, ctx }) => {
      const voterId = ctx.session.user.name!;

      console.log(input, voterId);

      return ctx.db.ballot
        .findUnique({
          select: defaultBallotSelect,
          where: {
            voterId_pollId_maci: {
              voterId,
              pollId: input.pollId,
              maci: config.maciAddress!,
            },
          },
        })
        .then((ballot) => ({
          ...ballot,
          votes: (ballot?.votes as Vote[]) ?? [],
        }));
    }),

  save: protectedProcedure
    .input(BallotSchema.extend({ pollId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const voterId = ctx.session.user.name!;

      await verifyUnpublishedBallot(voterId, input.pollId, ctx.db);

      return ctx.db.ballot.upsert({
        select: defaultBallotSelect,
        where: {
          voterId_pollId_maci: {
            voterId,
            pollId: input.pollId,
            maci: config.maciAddress!,
          },
        },
        update: input,
        create: { voterId, maci: config.maciAddress!, ...input },
      });
    }),

  lock: protectedProcedure
    .input(z.object({ pollId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const voterId = ctx.session.user.name!;

      await verifyUnpublishedBallot(voterId, input.pollId, ctx.db);

      return ctx.db.ballot.update({
        where: {
          voterId_pollId_maci: {
            voterId,
            pollId: input.pollId,
            maci: config.maciAddress!,
          },
        },
        data: { publishedAt: new Date() },
      });
    }),

  unlock: protectedProcedure
    .input(z.object({ pollId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const voterId = ctx.session.user.name!;

      return ctx.db.ballot.update({
        where: {
          voterId_pollId_maci: {
            voterId,
            pollId: input.pollId,
            maci: config.maciAddress!,
          },
        },
        data: { publishedAt: null },
      });
    }),

  publish: protectedProcedure
    .input(BallotPublishSchema.extend({ pollId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const voterId = ctx.session.user.name!;

      const ballot = await verifyUnpublishedBallot(
        voterId,
        input.pollId,
        ctx.db,
      );
      if (!ballot) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ballot doesn't exist",
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
        where: {
          voterId_pollId_maci: {
            voterId,
            pollId: input.pollId,
            maci: config.maciAddress!,
          },
        },
        data: { publishedAt: new Date(), signature },
      });
    }),
});

async function verifyBallotHash(hashed_votes: string, votes: Vote[]) {
  return hashed_votes === keccak256(Buffer.from(JSON.stringify(votes)));
}
async function verifyUnpublishedBallot(
  voterId: string,
  pollId: string,
  { ballot }: typeof db,
) {
  const existing = await ballot.findUnique({
    select: defaultBallotSelect,
    where: {
      voterId_pollId_maci: { voterId, pollId, maci: config.maciAddress! },
    },
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
  return verifyTypedData({
    ...ballotTypedData(chainId),
    address: address as Address,
    message,
    signature,
  });
}
