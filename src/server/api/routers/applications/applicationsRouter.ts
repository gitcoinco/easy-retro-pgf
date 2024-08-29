import { z } from "zod";

import {
  attestationProcedure,
  createTRPCRouter,
  roundProcedure,
} from "~/server/api/trpc";
import { FilterSchema } from "./utils/fetchApplications";
import { createDataFilter } from "~/utils/fetchAttestations";
import {
  fetchApplications,
  fetchApprovals,
  getApplicationStatus,
} from "./utils";

export const applicationsRouter = createTRPCRouter({
  approvals: roundProcedure
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      const { round } = ctx;
      const { ids: projectIds } = input;

      return fetchApprovals({
        round,
        projectIds,
      });
    }),

  status: roundProcedure
    .input(z.object({ projectId: z.string() }))
    .query(({ input: { projectId }, ctx: { round } }) =>
      getApplicationStatus({ round, projectId }).then(({ status }) => ({
        status,
      })),
    ),

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

      const { status, ...filter } = input;
      let ids;
      if (status === "approved") ids = approvedIds.length ? approvedIds : [""]; // empty string otherwise will fetch all
      if (status === "pending")
        ids = applicationsCount // non-approved applications
          .filter((a) => !approvedIds.includes(a.id))
          .map((a) => a.id);

      const applications = await fetchApplications({
        attestationFetcher,
        roundId,
        filter: { ...filter, ids },
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
