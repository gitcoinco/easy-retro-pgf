import { z } from "zod";

import { attestationProcedure, createTRPCRouter } from "~/server/api/trpc";
import {
  createDataFilter,
  createSearchFilter,
} from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { eas } from "~/config";
import { type Filter, FilterSchema } from "~/features/filter/types";
import { fetchMetadata } from "~/utils/fetchMetadata";

export const projectsRouter = createTRPCRouter({
  count: attestationProcedure.query(async ({ ctx }) => {
    const round = ctx.round;
    return ctx
      .fetchAttestations([eas.schemas.approval], {
        where: {
          attester: { in: round?.admins },
          AND: [
            createDataFilter("type", "bytes32", "application"),
            createDataFilter("round", "bytes32", String(round?.id)),
          ],
        },
      })
      .then((attestations = []) => {
        // Handle multiple approvals of an application - group by refUID
        return {
          count: Object.keys(
            attestations.reduce((acc, x) => ({ ...acc, [x.refUID]: true }), {}),
          ).length,
        };
      });
  }),
  get: attestationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input: { ids }, ctx }) => {
      if (!ids.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.fetchAttestations([eas.schemas.metadata], {
        where: { id: { in: ids } },
      });
    }),
  search: attestationProcedure
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      const round = ctx.round;
      if (!round)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Round not found",
        });

      const filters = [
        createDataFilter("type", "bytes32", "application"),
        createDataFilter("round", "bytes32", round.id),
      ];

      if (input.search) {
        filters.push(createSearchFilter(input.search));
      }

      return ctx
        .fetchAttestations([eas.schemas.approval], {
          where: {
            attester: { in: round.admins },
            ...createDataFilter("type", "bytes32", "application"),
          },
        })
        .then((attestations = []) => {
          const approvedIds = attestations
            .map(({ refUID }) => refUID)
            .filter(Boolean);

          return ctx.fetchAttestations([eas.schemas.metadata], {
            take: input.limit,
            skip: input.cursor * input.limit,
            orderBy: [createOrderBy(input.orderBy, input.sortOrder)],
            where: {
              id: { in: approvedIds },
              AND: filters,
            },
          });
        });
    }),

  // Used for distribution to get the projects' payoutAddress
  // To get this data we need to fetch all projects and their metadata
  payoutAddresses: attestationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input, ctx }) => {
      return ctx
        .fetchAttestations([eas.schemas.metadata], {
          where: { id: { in: input.ids } },
        })
        .then((attestations) =>
          Promise.all(
            attestations.map((attestation) =>
              fetchMetadata(attestation.metadataPtr).then((data) => {
                const { payoutAddress } = data as unknown as {
                  payoutAddress: string;
                };

                console.log({ payoutAddress });
                return { projectId: attestation.id, payoutAddress };
              }),
            ),
          ),
        )
        .then((projects) =>
          projects.reduce(
            (acc, x) => ({ ...acc, [x.projectId]: x.payoutAddress }),
            {},
          ),
        );
    }),
});

function createOrderBy(
  orderBy: Filter["orderBy"],
  sortOrder: Filter["sortOrder"],
) {
  const key = {
    time: "time",
    name: "decodedDataJson",
  }[orderBy];

  return { [key]: sortOrder };
}
