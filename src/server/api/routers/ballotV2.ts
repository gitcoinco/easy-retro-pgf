import { ballotProcedure, createTRPCRouter } from "~/server/api/trpc";
import type { Prisma, PrismaClient, Round } from "@prisma/client";

import { z } from "zod";
import {
  AllocationSchema,
  Allocation,
  BallotPublishSchema,
} from "~/features/ballot/types";
import { calculateBalancedAllocations } from "~/features/ballot/hooks/useBallotEditor";
import { TRPCError } from "@trpc/server";
import { isAfter } from "date-fns";
import { fetchApprovedVoter } from "~/utils/fetchAttestations";
import {
  verifyBallotCount,
  verifyBallotHash,
  verifyBallotSignature,
} from "~/utils/ballot";

export const defaultBallotSelect = {
  id: true,
  allocations: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  signature: true,
} satisfies Prisma.BallotV2Select;

export const ballotV2Router = createTRPCRouter({
  get: ballotProcedure.query(({ ctx }) => {
    const { roundId, voterId } = ctx;

    return ctx.db.ballotV2.findFirst({
      where: { voterId, roundId },
      select: defaultBallotSelect,
    });
  }),
  save: ballotProcedure
    .input(AllocationSchema)
    .mutation(async ({ input, ctx }) => {
      const { voterId, roundId, ballotId } = ctx;
      await ctx.db.allocation.upsert({
        where: {
          voterId_roundId_ballotId_id: {
            voterId,
            roundId,
            ballotId,
            id: input.id,
          },
        },
        update: input,
        create: { ...input, voterId, roundId, ballotId },
      });

      return autobalanceAllocations(ctx, input);
    }),
  remove: ballotProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { ballotId, roundId, voterId } = ctx;
      await ctx.db.allocation.delete({
        where: {
          voterId_roundId_ballotId_id: {
            id: input.id,
            voterId,
            roundId,
            ballotId,
          },
        },
      });
      return autobalanceAllocations(ctx);
    }),
  publish: ballotProcedure
    .input(BallotPublishSchema)
    .mutation(async ({ input, ctx }) => {
      const { round, ballot, voterId } = ctx;
      if (!round || !ballot) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Round or ballot not found",
        });
      }
      if (![round.resultAt, round.maxVotesTotal].every(Boolean)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Round not configured properly",
        });
      }

      if (isAfter(new Date(), round.resultAt!)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Voting has ended" });
      }

      if (ballot.publishedAt) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Ballot already published",
        });
      }
      if (!verifyBallotCount(ballot.allocations, round)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Ballot must have a maximum of ${round.maxVotesTotal} votes and ${round.maxVotesProject} per project.`,
        });
      }

      if (!(await fetchApprovedVoter(round, voterId))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Voter is not approved",
        });
      }

      if (
        !(await verifyBallotHash(
          input.message.hashed_allocations,
          ballot.allocations,
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

      return ctx.db.ballotV2.update({
        where: { id: ballot.id },
        data: { publishedAt: new Date(), signature },
      });
    }),
});

async function autobalanceAllocations(
  {
    db,
    ballotId,
    voterId,
    roundId,
    round,
  }: {
    db: PrismaClient;
    ballotId: string;
    voterId: string;
    roundId: string;
    round?: Round;
  },
  input?: Allocation,
) {
  const allocations = await db.allocation
    .findMany({ where: { ballotId } })
    .then((r) =>
      r.map(({ id, amount, locked }) =>
        id === input?.id ? input : { id, amount, locked },
      ),
    );

  const updates = calculateBalancedAllocations(
    allocations,
    round?.maxVotesTotal ?? 100,
    round?.maxVotesProject ?? 100,
  );

  await Promise.all(
    updates.map(({ id, ...data }) =>
      db.allocation.update({
        where: {
          voterId_roundId_ballotId_id: { voterId, ballotId, roundId, id },
        },
        data,
      }),
    ),
  );

  return db.ballotV2.findFirst({
    where: { voterId, roundId },
    select: defaultBallotSelect,
  });
}
