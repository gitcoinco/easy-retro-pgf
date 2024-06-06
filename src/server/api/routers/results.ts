import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { FilterSchema } from "~/features/filter/types";
import { fetchAttestations } from "~/utils/fetchAttestations";
import { config, eas } from "~/config";
import { type TallyData } from "maci-cli/sdk";
import { getAllApprovedProjects } from "./projects";
import { TRPCError } from "@trpc/server";

export const resultsRouter = createTRPCRouter({
  votes: publicProcedure
    .input(z.object({ pollId: z.string().nullish() }))
    .query(async ({ input }) => calculateMaciResults(input?.pollId)),

  project: publicProcedure
    .input(z.object({ id: z.string(), pollId: z.string().nullish() }))
    .query(async ({ input }) => {
      const { projects } = await calculateMaciResults(input?.pollId);

      return {
        amount: projects?.[input.id]?.votes ?? 0,
      };
    }),

  projects: publicProcedure
    .input(FilterSchema.extend({ pollId: z.string().nullish() }))
    .query(async ({ input }) => {
      const { projects } = await calculateMaciResults(input?.pollId);

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

export async function calculateMaciResults(pollId?: string | null) {
  if (!pollId) throw new Error("No pollId provided.");

  const [tallyData, projects] = await Promise.all([
    fetch(`${config.tallyUrl}/tally-${pollId}.json`)
      .then((res) => res.json() as Promise<TallyData>)
      .catch(() => undefined),
    getAllApprovedProjects(),
  ]);

  if (!tallyData) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Voting has not ended yet",
    });
  }

  const results = tallyData.results.tally.reduce((acc, tally, index) => {
    if (projects[index]) {
      acc.set(projects[index]!.id, { votes: Number(tally), voters: 0 });
    }

    return acc;
  }, new Map<string, { votes: number; voters: number }>());

  const averageVotes = calculateAverage(
    Object.values(Object.fromEntries(results)).map(({ votes }) => votes),
  );

  return {
    averageVotes,
    projects: Object.fromEntries(results),
  };
}

function calculateAverage(votes: number[]) {
  if (votes.length === 0) {
    return 0;
  }

  const sum = votes.reduce((sum, x) => sum + x, 0);

  const average = sum / votes.length;

  return Math.round(average);
}
