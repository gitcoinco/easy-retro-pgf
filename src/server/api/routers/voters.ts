import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  fetchAttestations,
  createDataFilter,
  fetchApprovedVoter,
} from "~/utils/fetchAttestations";
import { config, eas } from "~/config";

export const FilterSchema = z.object({
  limit: z.number().default(3 * 8),
  cursor: z.number().default(0),
});

export const votersRouter = createTRPCRouter({
  approved: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input }) => {
      return fetchApprovedVoter(input.address);
    }),
  list: publicProcedure.input(FilterSchema).query(async ({ ctx }) => {
    return fetchAttestations([eas.schemas.approval], {
      where: {
        attester: { in: config.admins },
        AND: [
          createDataFilter("type", "bytes32", "voter"),
          createDataFilter("round", "bytes32", config.roundId),
        ],
      },
    }).then(async (voters) => {
      const publishedBallots = await ctx.db.ballot
        .findMany({
          where: {
            voterId: { in: voters.map((v) => v.recipient) },
            publishedAt: { not: null },
          },
          select: { voterId: true, publishedAt: true },
        })
        .then((r) =>
          Object.fromEntries(r.map((v) => [v.voterId, Boolean(v.publishedAt)])),
        );
      return voters.map((v) => ({
        ...v,
        hasVoted: publishedBallots?.[v.recipient],
      }));
    });
  }),
});
