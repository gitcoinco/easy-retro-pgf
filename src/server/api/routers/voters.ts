import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { attestationProcedure, createTRPCRouter } from "~/server/api/trpc";
import {
  createDataFilter,
  fetchApprovedVoter,
} from "~/utils/fetchAttestations";
import { fetchVoterLimits } from "~/utils/fetchVoterLimits";

const VoterInputSchema = z.object({
  address: z.string(),
  maxVotesTotal: z.number().positive(),
  maxVotesProject: z.number().positive(),
});

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
  createVoters: attestationProcedure
    .input(z.array(VoterInputSchema))
    .mutation(async ({ input, ctx }) => {
      const upsertedVoters = await Promise.all(
        input.map(async (voter) => {
          return ctx.db.voterConfig.upsert({
            where: {
              voterId_roundId: {
                voterId: voter.address,
                roundId: ctx.round!.id,
              },
            },
            update: {
              maxVotesTotal: voter.maxVotesTotal,
              maxVotesProject: voter.maxVotesProject,
            },
            create: {
              voterId: voter.address,
              roundId: ctx.round!.id,
              maxVotesTotal: voter.maxVotesTotal,
              maxVotesProject: voter.maxVotesProject,
            },
          });
        }),
      );

      return upsertedVoters;
    }),
  voteCounts: attestationProcedure.query(async ({ ctx }) => {
    if (!ctx.round?.id)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Round ID not found",
      });
    return ctx.db.voterConfig.findMany({ where: { roundId: ctx.round?.id } });
  }),
  voteCountPerAddress: attestationProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input, ctx }) => {
      return fetchVoterLimits(ctx.round!, input.address);
    }),
});
