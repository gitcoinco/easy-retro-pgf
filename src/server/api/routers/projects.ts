import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  fetchAttestations,
  createDataFilter,
  type Attestation,
} from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { config, eas } from "~/config";
import { FilterSchema } from "~/features/filter/types";
import { fetchMetadata } from "~/utils/fetchMetadata";
import { searchProjects } from "~/utils/searchProjects";

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
  search: publicProcedure
    .input(FilterSchema)
    .query(async ({ input }) => searchProjects(input)),

  // Used for distribution to get the projects' payoutAddress
  // To get this data we need to fetch all projects and their metadata
  payoutAddresses: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input }) => {
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

  roundProjectsWithMetadata: publicProcedure
    .input(FilterSchema)
    .query(async ({ input }) => {
      const projects: Attestation[] = await searchProjects(input);

      const projectsWithMetadata = await Promise.all(
        projects.map(async (project) => {
          const { name, metadataPtr } = project;
          const metadata = await fetchMetadata(metadataPtr);
          return {
            ...metadata,
            name,
          };
        }),
      );
      return projectsWithMetadata;
    }),
});
