import {
  adminProcedure,
  attestationProcedure,
  roundProcedure,
  createTRPCRouter,
  adminAttestationProcedure,
} from "~/server/api/trpc";
import { FilterSchema } from "~/features/filter/types";
import { TRPCError } from "@trpc/server";
import { getState } from "~/features/rounds/hooks/useRoundState";
import { RoundSchema } from "~/features/rounds/types";
import { calculateBallotResults } from "~/server/api/utils/calculateBallotResults";
import { z } from "zod";
import { calculateDistributionsByProject } from "~/server/api/utils/calculateDistributionsByProject";
import { getPayoutAddressesFromAttestations } from "~/server/api/utils/getPayoutAddressesFromAttestations";

export const resultsRouter = createTRPCRouter({
  distribution: adminAttestationProcedure
    .input(
      z.object({
        totalTokens: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const votes = await calculateBallotResults(String(ctx.round?.id), ctx.db);
      const totalVotes = votes.totalVotes;
      const projectVotes = votes.projects ?? {};
      const projectIds = Object.keys(votes.projects ?? {});

      let totalTokens = 0n;

      try {
        totalTokens = BigInt(input.totalTokens);
      } catch (error) {
        throw new Error("Invalid totalTokens value, can not convert to bigint");
      }

      const payoutAddresses = await ctx
        .fetchAttestations(["metadata"], {
          where: { id: { in: projectIds } },
        })
        .then(getPayoutAddressesFromAttestations);

      const distributions = calculateDistributionsByProject({
        projectIds,
        projectVotes,
        totalTokens,
        totalVotes,
        payoutAddresses,
      });

      return { totalVotes, projectIds, distributions };
    }),
  votes: adminProcedure.query(async ({ ctx }) =>
    calculateBallotResults(String(ctx.round?.id), ctx.db),
  ),
  results: roundProcedure.query(async ({ ctx }) => {
    const round = await ctx.db.round.findFirst({ where: { id: ctx.round.id } });
    if (!round) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }
    if (getState(round as unknown as RoundSchema) !== "RESULTS") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Results not available yet",
      });
    }
    return calculateBallotResults(ctx.round.id, ctx.db);
  }),

  projects: attestationProcedure
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      const roundId = String(ctx.round?.id);

      if (getState(ctx.round) !== "RESULTS") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Results not available yet",
        });
      }
      const { projects } = await calculateBallotResults(roundId, ctx.db);

      const sortedIDs = Object.entries(projects ?? {})
        .sort((a, b) => b[1].votes - a[1].votes)
        .map(([id]) => id)
        .slice(
          input.cursor * input.limit,
          input.cursor * input.limit + input.limit,
        );

      return ctx
        .fetchAttestations(["metadata"], {
          where: {
            id: { in: sortedIDs },
          },
        })
        .then((attestations) =>
          // Results aren't returned from EAS in the same order as the `where: { in: sortedIDs }`
          // Sort the attestations based on the sorted array
          attestations.sort(
            (a, b) => sortedIDs.indexOf(a.id) - sortedIDs.indexOf(b.id),
          ),
        );
    }),
});
