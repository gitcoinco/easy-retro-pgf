import { z } from "zod";

import { attestationProcedure, createTRPCRouter } from "~/server/api/trpc";
import { fetchApplications, fetchApprovals } from "./utils";

export const FilterSchema = z.object({
  limit: z.number().default(3 * 8),
  cursor: z.number().default(0),
});

export const applicationsRouter = createTRPCRouter({
  approvals: attestationProcedure
    .input(z.object({ ids: z.array(z.string()).optional() }))
    .query(async ({ input, ctx }) => {
      const {
        fetchAttestations: attestationFetcher,
        round: { id: roundId, admins },
      } = ctx;
      const { ids: projectIds } = input;

      return fetchApprovals({
        attestationFetcher,
        admins,
        projectIds,
        roundId,
      });
    }),

  list: attestationProcedure
    .input(z.object({ ids: z.array(z.string()).optional() }))
    .query(async ({ ctx }) => {
      const {
        fetchAttestations: attestationFetcher,
        round: { id: roundId },
      } = ctx;

      const applications = await fetchApplications({
        attestationFetcher,
        roundId,
      });

      return applications;
    }),
});
