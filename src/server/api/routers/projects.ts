import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchAttestations, createDataFilter } from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { config, eas } from "~/config";
import { type Filter, FilterSchema } from "~/features/filter/types";

export const projectsRouter = createTRPCRouter({
  count: publicProcedure.query(async ({}) => {
    return fetchAttestations([eas.schemas.approval], {
      where: {
        attester: { in: config.admins },
        AND: [
          createDataFilter("type", "bytes32", "application"),
          createDataFilter("round", "bytes32", config.roundId),
        ],
      },
    }).then((attestations = []) => {
      // Handle multiple approvals of an application - group by refUID
      return {
        count: Object.keys(
          attestations.reduce((acc, x) => ({ ...acc, [x.refUID]: true }), {}),
        ).length,
      };
    });
  }),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      if (!id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return fetchAttestations([eas.schemas.metadata], {
        where: { id: { equals: id } },
      }).then(([attestation]) => {
        if (!attestation) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return attestation;
      });
    }),
  search: publicProcedure.input(FilterSchema).query(async ({ input }) => {
    return fetchAttestations([eas.schemas.approval], {
      where: {
        attester: { in: config.admins },
        ...createDataFilter("type", "bytes32", "application"),
      },
    }).then((attestations = []) => {
      const approvedIds = attestations
        .map(({ refUID }) => refUID)
        .filter(Boolean);

      const filters = [
        createDataFilter("type", "bytes32", "application"),
        createDataFilter("round", "bytes32", config.roundId),
      ];
      if (input.search) {
        filters.push(createDataFilter("name", "string", input.search));
      }

      return fetchAttestations([eas.schemas.metadata], {
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
