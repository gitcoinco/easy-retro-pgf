import { ballotProcedure, createTRPCRouter } from "~/server/api/trpc";
import type { Prisma, PrismaClient } from "@prisma/client";

import { z } from "zod";
import { AllocationSchema, Allocation } from "~/features/ballot/types";

const defaultBallotSelect = {
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
  publish: ballotProcedure.mutation(({ ctx }) => {}),
});

async function autobalanceAllocations(
  {
    db,
    ballotId,
    voterId,
    roundId,
  }: { db: PrismaClient; ballotId: string; voterId: string; roundId: string },
  input?: Allocation,
) {
  const allocations = await db.allocation
    .findMany({ where: { ballotId } })
    .then((r) =>
      r.map(({ id, amount, locked }) =>
        id === input?.id ? input : { id, amount, locked },
      ),
    );

  const locked = allocations.filter((alloc) => alloc.locked);
  const lockedAmount = locked.reduce((sum, x) => sum + Number(x.amount), 0);

  const unlocked = allocations
    .filter((alloc) => !alloc.locked)
    .map((alloc, i, arr) => ({
      ...alloc,
      amount: (100 - lockedAmount) / arr.length,
    }));
  const updates = [...locked, ...unlocked];
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
