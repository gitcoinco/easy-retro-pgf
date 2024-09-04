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
    .input(
      FilterSchema.merge(
        z.object({
          expirationTime: z.number().optional(),
        }),
      ),
    )
    .query(async ({ input, ctx }) => {
      const { round } = ctx;
      const { ids: projectIds, expirationTime } = input;

      return fetchApprovals({
        round,
        projectIds,
        expirationTime,
      });
    }),

  status: roundProcedure
    .input(
      z.object({
        projectId: z.string(),
        withAttestation: z.boolean().default(false),
      }),
    )
    .query(
      async ({ input: { projectId, withAttestation }, ctx: { round } }) => {
        const result = await getApplicationStatus({
          round,
          projectId,
          withAttestation,
        });
        return result;
      },
    ),

  list: attestationProcedure
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      const {
        fetchAttestations: attestationFetcher,
        round: { id: roundId, admins },
      } = ctx;

      // Fetch eas approvals + applicationIds. Note approval attestations include both approved & rejected attestations
      const [approvals, applicationIds] = await Promise.all([
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

      const applicationdsWithStatus = await Promise.all(
        applicationIds.map(async (a) => ({
          id: a.id,
          status: await getApplicationStatus({
            round: ctx.round,
            projectId: a.id,
          }),
        })),
      );
      const { ...filter } = input;

      let ids: string[] = [];
      if (filter.status === "approved") {
        ids = applicationdsWithStatus
          .filter((a) => a.status.status === "approved")
          .map((a) => a.id);
      } else if (filter.status === "pending") {
        ids = applicationdsWithStatus
          .filter((a) => a.status.status === "pending")
          .map((a) => a.id);
      } else if (filter.status === "all") {
        ids = applicationIds.map((a) => a.id);
      }

      // Note that this fetches all applications when ids is empty
      const applications = await fetchApplications({
        attestationFetcher,
        roundId,
        filter: { ...filter, ids },
      });

      const approvedById = Object.fromEntries(
        approvals.map((a) => [a.refUID, { attester: a.attester, uid: a.id }]),
      );

      const data =
        ids.length > 0
          ? applications.map((a) => ({
              ...a,
              status: applicationdsWithStatus.find((s) => s.id === a.id)?.status
                .status,
              approvedBy: approvedById[a.id],
            }))
          : [];

      return {
        count: applicationIds.length,
        data,
      };
    }),
});
