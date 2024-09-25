import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  fetchAttestations,
  createDataFilter,
  createSearchFilter,
} from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { config, eas, filecoinRounds, getStartsAt } from "~/config";
import { type Filter, FilterSchema } from "~/features/filter/types";
import { fetchMetadata } from "~/utils/fetchMetadata";

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
    .input(
      z.object({ ids: z.array(z.string()), startsAt: z.number().optional() }),
    )
    .query(async ({ input: { ids, startsAt } }) => {
      if (!ids.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return fetchAttestations(
        [eas.schemas.metadata],
        {
          where: { id: { in: ids } },
        },
        startsAt,
      );
    }),
  search: publicProcedure.input(FilterSchema).query(async ({ input }) => {
    const startsAt = +getStartsAt(input.round) / 1000;

    const filters = [
      createDataFilter("type", "bytes32", "application"),
      createDataFilter("round", "bytes32", input.round),
    ];

    if (input.search) {
      filters.push(createSearchFilter(input.search));
    }

    return fetchAttestations(
      [eas.schemas.approval],
      {
        where: {
          attester: {
            in: filecoinRounds[input.round as keyof typeof filecoinRounds],
          },
          ...createDataFilter("type", "bytes32", "application"),
        },
      },
      startsAt,
    ).then((attestations = []) => {
      const approvedIds = attestations
        .map(({ refUID }) => refUID)
        .filter(Boolean);

      return fetchAttestations(
        [eas.schemas.metadata],
        {
          take: input.limit,
          skip: input.cursor * input.limit,
          orderBy: [createOrderBy(input.orderBy, input.sortOrder)],
          where: {
            id: { in: approvedIds },
            AND: filters,
          },
        },
        startsAt,
      );
    });
  }),

  // Used for distribution to get the projects' payoutAddress
  // To get this data we need to fetch all projects and their metadata
  payoutAddresses: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input }) => {
      console.log({ input });
      return fetchAttestations([eas.schemas.metadata], {
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
