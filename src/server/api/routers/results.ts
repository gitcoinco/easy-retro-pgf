import { z } from "zod";
import type { PrismaClient } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { FilterSchema } from "~/features/filter/types";
import { fetchAttestations } from "~/utils/fetchAttestations";
import { eas } from "~/config";
import { calculateVotes } from "~/utils/calculateResults";
import { type Vote } from "~/features/ballot/types";
import { getSettings } from "./config";

export const resultsRouter = createTRPCRouter({
  votes: publicProcedure.query(async ({ ctx }) =>
    calculateBallotResults(ctx.db),
  ),
  project: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { projects } = await calculateBallotResults(ctx.db);

      return {
        amount: projects?.[input.id]?.votes ?? 0,
      };
    }),

  projects: publicProcedure
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      const { projects } = await calculateBallotResults(ctx.db);

      const sortedIDs = Object.entries(projects ?? {})
        .sort((a, b) => b[1].votes - a[1].votes)
        .map(([id]) => id)
        .slice(
          input.cursor * input.limit,
          input.cursor * input.limit + input.limit,
        );

      return fetchAttestations([eas.schemas.metadata], {
        where: {
          id: { in: sortedIDs },
        },
      }).then((attestations) =>
        // Results aren't returned from EAS in the same order as the `where: { in: sortedIDs }`
        // Sort the attestations based on the sorted array
        attestations.sort(
          (a, b) => sortedIDs.indexOf(a.id) - sortedIDs.indexOf(b.id),
        ),
      );
    }),
});

async function calculateBallotResults(db: PrismaClient) {
  const settings = await getSettings(db);
  const calculation = settings?.config?.calculation;
  if (!calculation) {
    console.log("No calculation stored");
    return {};
  }
  // When the Minimum Qurom input is empty, return empty
  if (calculation?.style === "op" && !calculation?.threshold) {
    return {};
  }

  // Fetch the ballots
  const ballots = await db.ballot.findMany({
    where: { publishedAt: { not: undefined } },
  });

  const projects = calculateVotes(
    ballots as unknown as { voterId: string; votes: Vote[] }[],
    calculation,
  );

  const averageVotes = 0;
  const totalVotes = ballots.reduce((sum, x) => sum + x.votes.length, 0);
  const totalVoters = ballots.length;

  return { projects, totalVoters, totalVotes, averageVotes };
}
