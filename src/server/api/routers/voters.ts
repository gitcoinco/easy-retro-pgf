import { z } from "zod";

import { attestationProcedure, createTRPCRouter } from "~/server/api/trpc";
import {
  createDataFilter,
  fetchApprovedVoter,
} from "~/utils/fetchAttestations";

export const votersRouter = createTRPCRouter({
  approved: attestationProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input, ctx }) => {
      return fetchApprovedVoter(ctx.round!, input.address);
    }),
  list: attestationProcedure.query(async ({ ctx }) => {
    return ctx
      .fetchAttestations(["approval"], {
        where: {
          AND: [
            { attester: { in: ctx.round?.admins } },
            createDataFilter("type", "bytes32", "voter"),
            createDataFilter("round", "bytes32", String(ctx.round?.id)),
          ],
        },
      })
      .then(async (voters) => {
        const publishedBallots = await ctx.db.ballot
          .findMany({
            where: {
              voterId: { in: voters.map((v) => v.recipient) },
              publishedAt: { not: null },
            },
            select: { voterId: true, publishedAt: true },
          })
          .then((r) =>
            Object.fromEntries(
              r.map((v) => [v.voterId, Boolean(v.publishedAt)]),
            ),
          );
        return voters.map((v) => ({
          ...v,
          hasVoted: publishedBallots?.[v.recipient],
        }));
      });
  }),
});
