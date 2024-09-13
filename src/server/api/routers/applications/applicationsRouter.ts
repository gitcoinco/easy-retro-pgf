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
import type { ApplicationStatus } from "./types";
import { possibleSpamIds } from "public/possibleSpamIds";

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
        round: { id: roundId },
      } = ctx;

      // Fetch eas approvals + applicationIds. Note approval attestations include both approved & rejected attestations
      const [approvals, applicationIds] = await Promise.all([
        fetchApprovals({
          round: ctx.round,
          includeRevoked: true,
          expirationTime: Date.now(),
        }),
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

      // filter approvals by applicationIds & if there are multile approvals for the same application, only keep the last one
      const filteredApprovals = approvals.filter((a, i) => {
        const isLast = approvals.findIndex((b) => b.refUID === a.refUID) === i;
        return isLast;
      });

      const approvedApplicationIds: string[] = [];
      const pendingApplicationIds: string[] = [];
      const rejectedApplicationIds: string[] = [];
      const possibleSpamApplicationIds: string[] = [];

      const applicationIdsWithStatus = applicationIds.map(({ id }) => {
        const applicationApproval = filteredApprovals.find(
          (approval) => approval.refUID === id,
        );

        if (possibleSpamIds.includes(id.toLocaleLowerCase())) {
          possibleSpamApplicationIds.push(id);
          return {
            id,
            status: "spam",
          };
        }

        let status: ApplicationStatus;
        switch (true) {
          case !applicationApproval:
            status = "pending";
            pendingApplicationIds.push(id);
            break;
          case applicationApproval?.revoked:
            status = "rejected";
            rejectedApplicationIds.push(id);
            break;
          default:
            status = "approved";
            approvedApplicationIds.push(id);
        }

        return {
          id,
          status,
        };
      });

      const { ...filter } = input;

      const filteredIds: string[] = (() => {
        switch (filter.status) {
          case "approved":
            return approvedApplicationIds;
          case "pending":
            return pendingApplicationIds;
          case "rejected":
            return rejectedApplicationIds;
          case "spam":
            return possibleSpamApplicationIds;
          default:
            return [];
        }
      })();

      // Note that this fetches all applications when ids is empty
      const applications = await fetchApplications({
        attestationFetcher,
        roundId,
        filter: { ...filter, ids: filteredIds },
      });

      const approvalsById = Object.fromEntries(
        filteredApprovals.map((a) => [
          a.refUID,
          { attester: a.attester, uid: a.id },
        ]),
      );

      const applicationsWithStatus = applications.map((a) => ({
        ...a,
        status: applicationIdsWithStatus.find((s) => s.id === a.id)?.status,
        approvedBy: approvalsById[a.id],
      }));

      const data =
        filter.status === "all"
          ? applicationsWithStatus
          : filteredIds.length === 0
            ? []
            : applicationsWithStatus;

      return {
        count: applicationIds.length,
        countApproved: approvedApplicationIds.length,
        countPending: pendingApplicationIds.length,
        countRejected: rejectedApplicationIds.length,
        countSpam: possibleSpamApplicationIds.length,
        data,
      };
    }),
});
