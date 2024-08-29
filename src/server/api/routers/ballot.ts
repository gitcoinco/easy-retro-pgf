import {
  adminProcedure,
  ballotProcedure,
  createTRPCRouter,
} from "~/server/api/trpc";
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
import {
  createAttestationFetcher,
  fetchApprovedVoter,
} from "~/utils/fetchAttestations";
import {
  verifyBallotCount,
  verifyBallotHash,
  verifyBallotSignature,
} from "~/utils/ballot";
import { RoundTypes } from "~/features/rounds/types";

export const defaultBallotSelect = {
  id: true,
  allocations: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  signature: true,
} satisfies Prisma.BallotV2Select;

export const ballotRouter = createTRPCRouter({
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

  export: adminProcedure.mutation(({ ctx }) => {
    return ctx.db.ballotV2
      .findMany({
        where: { publishedAt: { not: null } },
        include: { allocations: true },
      })
      .then(async (ballots) => {
        let projectsById: Record<string, string> = {};
        if (ctx.round?.type === "project") {
          // Get all unique projectIds from all the votes
          const projectIds = Object.keys(
            Object.fromEntries(
              ballots.flatMap((b) =>
                b.allocations.map((v) => v.id).map((n) => [n, n]),
              ),
            ),
          );
          projectsById = await createAttestationFetcher({ round: ctx.round })(
            ["metadata"],
            {
              where: { id: { in: projectIds } },
            },
          ).then((projects) =>
            Object.fromEntries(projects.map((p) => [p.id, p.name])),
          );
          return ballots.flatMap(
            ({ voterId, signature, publishedAt, allocations }) =>
              allocations.map(({ amount, id }) => ({
                voterId,
                signature,
                publishedAt,
                amount,
                id,
                project: projectsById?.[id],
              })),
          );
        } else if (ctx.round?.type === "impact") {
          return ballots.flatMap(
            ({ voterId, signature, publishedAt, allocations }) =>
              allocations.map(({ amount, id }) => ({
                voterId,
                signature,
                publishedAt,
                amount,
                id,
              })),
          );
        }
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
  // When Round type is impact, always use percetages (100)
  const [maxAllocation, allocationCap] =
    round?.type === RoundTypes.impact
      ? [100, 100]
      : [round?.maxVotesTotal ?? 0, round?.maxVotesProject ?? 0];

  const updates = calculateBalancedAllocations(
    allocations,
    maxAllocation,
    allocationCap,
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
