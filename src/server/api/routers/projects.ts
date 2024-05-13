import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  fetchAttestations,
  createDataFilter,
  createSearchFilter,
  type Attestation,
} from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { config, eas } from "~/config";
import {
  type Filter,
  FilterSchema,
  OrderBy,
  SortOrder,
} from "~/features/filter/types";
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
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input: { ids } }) => {
      if (!ids.length) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return fetchAttestations([eas.schemas.metadata], {
        where: { id: { in: ids } },
      });
    }),

  search: publicProcedure.input(FilterSchema).query(async ({ input }) => {
    const filters = [
      createDataFilter("type", "bytes32", "application"),
      createDataFilter("round", "bytes32", config.roundId),
    ];

    if (input.search) {
      filters.push(createSearchFilter(input.search));
    }

    return fetchAttestations([eas.schemas.approval], {
      where: {
        attester: { in: config.admins },
        ...createDataFilter("type", "bytes32", "application"),
      },
    }).then((attestations = []) => {
      const approvedIds = attestations
        .map(({ refUID }) => refUID)
        .filter(Boolean);

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

  allApproved: publicProcedure.query(async () => {
    const filters = [
      createDataFilter("type", "bytes32", "application"),
      createDataFilter("round", "bytes32", config.roundId),
    ];

    return fetchAttestations([eas.schemas.approval], {
      where: {
        attester: { in: config.admins },
        ...createDataFilter("type", "bytes32", "application"),
      },
    }).then((attestations = []) => {
      const approvedIds = attestations
        .map(({ refUID }) => refUID)
        .filter(Boolean);

      return fetchAttestations([eas.schemas.metadata], {
        orderBy: [createOrderBy(OrderBy.time, SortOrder.asc)],
        where: {
          id: { in: approvedIds },
          AND: filters,
        },
      });
    });
  }),
});

export async function getAllApprovedProjects(): Promise<Attestation[]> {
  const filters = [
    createDataFilter("type", "bytes32", "application"),
    createDataFilter("round", "bytes32", config.roundId),
  ];

  return fetchAttestations([eas.schemas.approval], {
    where: {
      attester: { in: config.admins },
      ...createDataFilter("type", "bytes32", "application"),
    },
  }).then((attestations = []) => {
    const approvedIds = attestations
      .map(({ refUID }) => refUID)
      .filter(Boolean);

    return fetchAttestations([eas.schemas.metadata], {
      orderBy: [createOrderBy(OrderBy.time, SortOrder.asc)],
      where: {
        id: { in: approvedIds },
        AND: filters,
      },
    });
  });
}

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
