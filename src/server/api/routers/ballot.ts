import { TRPCError } from "@trpc/server";
import { type Address, verifyTypedData } from "viem";

import {
  type BallotPublish,
  BallotPublishSchema,
  BallotSchema,
  type Vote,
} from "~/features/ballot/types";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ballotTypedData } from "~/utils/typedData";
import type { db } from "~/server/db";

export const ballotRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    const voterId = ctx.session.user.name!;
    return ctx.db.ballot.findUnique({ where: { voterId } }).then((ballot) => ({
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
        where: { voterId },
        update: input,
        create: { voterId, ...input },
      });
    }),
  publish: protectedProcedure
    .input(BallotPublishSchema)
    .mutation(async ({ input, ctx }) => {
      const voterId = ctx.session.user.name!;

      await verifyUnpublishedBallot(voterId, ctx.db);

      // Verify badgeholder

      const { message, signature } = input;
      await verifyBallotSignature({ message, signature, address: voterId });

      return ctx.db.ballot.update({
        where: { voterId },
        data: { publishedAt: new Date(), signature },
      });
    }),
});

async function verifyUnpublishedBallot(voterId: string, { ballot }: typeof db) {
  const existing = await ballot.findUnique({ where: { voterId } });
  if (!existing) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  // Can only be submitted once
  if (existing.publishedAt) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Ballot already published",
    });
  }
  return true;
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
