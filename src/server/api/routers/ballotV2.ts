import { ballotProcedure, createTRPCRouter } from "~/server/api/trpc";
import type { Prisma } from "@prisma/client";

import { z } from "zod";
import { RoundTypes } from "~/features/rounds/types";

const defaultBallotSelect = {
  id: true,
  allocations: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  signature: true,
} satisfies Prisma.BallotV2Select;

const AllocationSchema = z.object({
  id: z.string(),
  amount: z.number().min(0),
  type: z.nativeEnum(RoundTypes).optional(),
  locked: z.boolean().default(true),
});

export const ballotV2Router = createTRPCRouter({
  get: ballotProcedure.query(({ ctx }) => {
    const voterId = ctx.session?.user.name!;
    const roundId = ctx.round?.id;

    return ctx.db.ballotV2.findFirst({
      where: { voterId, roundId },
      select: defaultBallotSelect,
    });
  }),
  save: ballotProcedure
    .input(AllocationSchema)
    .mutation(async ({ input, ctx }) => {
      const { ballotId, roundId, voterId } = ctx;
      return ctx.db.allocation.upsert({
        where: {
          voterId_roundId_ballotId_id: {
            id: input.id,
            voterId,
            roundId,
            ballotId,
          },
        },
        update: { ...input },
        create: { ...input, voterId, roundId, ballotId },
      });
    }),
  remove: ballotProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { ballotId, roundId, voterId } = ctx;
      return ctx.db.allocation.delete({
        where: {
          voterId_roundId_ballotId_id: {
            id: input.id,
            voterId,
            roundId,
            ballotId,
          },
        },
      });
    }),
  publish: ballotProcedure.mutation(({ ctx }) => {}),
});
