import { attestationProcedure, createTRPCRouter } from "~/server/api/trpc";
import { fetchApplications, fetchApprovals } from "./utils";
import { FilterSchema } from "./utils/fetchApplications";

export const applicationsRouter = createTRPCRouter({
  approvals: attestationProcedure
    .input(FilterSchema)
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
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      const {
        fetchAttestations: attestationFetcher,
        round: { id: roundId, admins },
      } = ctx;

      const approved = await fetchApprovals({
        attestationFetcher,
        admins,
        projectIds: input.ids,
        roundId,
      });
      const applications = await fetchApplications({
        attestationFetcher,
        roundId,
        filter: {
          ...input,
          ids:
            input.status === "pending" ? approved.map((a) => a.id) : undefined,
        },
      });

      return applications;
    }),
});
