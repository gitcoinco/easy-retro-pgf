import { attestationProcedure, createTRPCRouter } from "~/server/api/trpc";
import { fetchApplications, fetchApprovals } from "./utils";
import { FilterSchema } from "./utils/fetchApplications";
import { createDataFilter } from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";

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

      // Fetch approved applications + application count
      const [approved, applicationsCount] = await Promise.all([
        attestationFetcher(
          ["approval"],
          {
            where: {
              attester: { in: admins },
              AND: [
                createDataFilter("type", "bytes32", "application"),
                createDataFilter("round", "bytes32", roundId),
              ],
            },
          },
          ["id", "refUID", "attester"], // Only fetch the required fields for smaller data payload
        ),
        attestationFetcher(
          ["metadata"],
          {
            where: {
              AND: [
                createDataFilter("type", "bytes32", "application"),
                createDataFilter("round", "bytes32", roundId),
              ],
            },
          },
          ["id"],
        ),
      ]);
      const approvedIds = approved.map((a) => a.refUID);

      const applications = await fetchApplications({
        attestationFetcher,
        roundId,
        // filter: {
        //   ...input,
        //   ids: input.status === "pending" ? approvedIds : undefined,
        // },
      });

      const approvedById = Object.fromEntries(
        approved.map((a) => [a.refUID, { attester: a.attester, uid: a.id }]),
      );

      const data = applications.map((a) => ({
        ...a,
        status: approvedById[a.id] ? "approved" : "pending",
        approvedBy: approvedById[a.id],
      }));

      return {
        count: applicationsCount.length,
        data,
      };
    }),
});
