import { z } from "zod";

import {
  attestationProcedure,
  createTRPCRouter,
  roundProcedure,
} from "~/server/api/trpc";
import {
  type Attestation,
  createAttestationFetcher,
  createDataFilter,
  createSearchFilter,
} from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { type Filter, FilterSchema } from "~/features/filter/types";
import { fetchMetadata } from "~/utils/fetchMetadata";
import { fetchProfiles } from "./profile/utils";
import { fetchImpactMetricsFromCSV } from "~/utils/fetchMetrics";
import { getApplicationStatus } from "./applications/utils";
import type { OSOMetricsCSV } from "~/types";
import type { ApplicationStatus } from "./applications/types";
import { indexMetricsByProjectId } from "~/utils/fetchMetrics";

export const projectsRouter = createTRPCRouter({
  count: attestationProcedure.query(async ({ ctx }) => {
    const round = ctx.round;
    return ctx
      .fetchAttestations(["approval"], {
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

      const projects = await ctx.fetchAttestations(["metadata"], {
        where: { id: { in: ids } },
      });

      return projects;
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
        .fetchAttestations(["approval"], {
          where: {
            attester: { in: round.admins },
            ...createDataFilter("type", "bytes32", "application"),
          },
        })
        .then((attestations = []) => {
          const approvedIds = attestations
            .map(({ refUID }) => refUID)
            .filter(Boolean);

          return ctx.fetchAttestations(["metadata"], {
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

  list: attestationProcedure
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      const { fetchAttestations: attestationFetcher, round } = ctx;
      if (!round)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Round not found",
        });
      try {
        const filter = [
          createDataFilter("type", "bytes32", "application"),
          createDataFilter("round", "bytes32", round.id),
        ];
        // Fetch Project applications
        return ctx
          .fetchAttestations(["metadata"], {
            where: { AND: filter },
            take: input.limit,
            skip: input.cursor * input.limit,
            orderBy: [createOrderBy(input.orderBy, input.sortOrder)],
          })
          .then(async (projects) => {
            // Fetch Profiles for projects
            const profiles = await fetchProfiles({
              attestationFetcher,
              round,
              recipients: projects.map((p) => p.recipient),
            });

            const metadata = await fetchMetadataForProjects(projects, profiles);

            // Fetch application approvals for round by admins
            const approvals = await ctx.fetchAttestations(["approval"], {
              where: {
                AND: [...filter, { attester: { in: round.admins } }],
              },
            });

            const approvalsById = Object.fromEntries(
              approvals.map((a) => [a.refUID, a]),
            );

            return projects.map((project) => {
              const approval = approvalsById[project.id];
              return {
                ...project,
                profile: metadata.profiles[project.recipient],
                metadata: metadata.projects[project.id],
                status: !approval
                  ? "pending"
                  : approval.revoked
                    ? "rejected"
                    : "approved",
              };
            });
          });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (error as Error).message,
        });
      }
    }),

  listApproved: attestationProcedure
    .input(FilterSchema)
    .query(async ({ input, ctx }) => {
      const { fetchAttestations: attestationFetcher, round } = ctx;
      if (!round)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Round not found",
        });
      try {
        const filter = [
          createDataFilter("type", "bytes32", "application"),
          createDataFilter("round", "bytes32", round.id),
        ];
        // Fetch Project applications
        return ctx
          .fetchAttestations(["metadata"], {
            where: { AND: filter },
            take: input.limit,
            skip: input.cursor * input.limit,
            orderBy: [createOrderBy(input.orderBy, input.sortOrder)],
          })
          .then(async (projects) => {
            // Fetch Profiles for projects
            const profiles = await fetchProfiles({
              attestationFetcher,
              round,
              recipients: projects.map((p) => p.recipient),
            });

            const metadata = await fetchMetadataForProjects(projects, profiles);

            // Fetch application approvals for round by admins
            const approvals = await ctx.fetchAttestations(["approval"], {
              where: {
                AND: [...filter, { attester: { in: round.admins } }],
              },
            });

            const approvalsById = Object.fromEntries(
              approvals.map((a) => [a.refUID, a]),
            );

            const projectsWithMetadata = projects.map((project) => {
              const approval = approvalsById[project.id];
              return {
                ...project,
                profile: metadata.profiles[project.recipient],
                metadata: metadata.projects[project.id],
                status: !approval
                  ? "pending"
                  : approval.revoked
                    ? "rejected"
                    : "approved",
              };
            });
            return projectsWithMetadata.filter(
              (project) => project.status === "approved",
            );
          });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (error as Error).message,
        });
      }
    }),

  listSunnyProjects: roundProcedure
    .input(FilterSchema)
    .query(
      async ({
        input: {
          cursor: paginationCursor,
          limit: paginationLimit,
          orderBy,
          sortOrder,
        },
        ctx: { round },
      }) => {
        if (!round)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Round not found",
          });
        try {
          const attestationFetcher = createAttestationFetcher({ round });

          // Fetch Project applications
          const projects = await attestationFetcher(
            ["metadata"],
            {
              where: {
                AND: [
                  createDataFilter("type", "bytes32", "application"),
                  createDataFilter("round", "bytes32", round.id),
                ],
              },
              take: paginationLimit,
              skip: paginationCursor * paginationLimit,
              orderBy: [createOrderBy(orderBy, sortOrder)],
            },
            ["id", "decodedDataJson", "recipient"],
          );

          const statusByProjectId: Record<string, ApplicationStatus> = {};

          // Fetch all status in parallel
          await Promise.all(
            projects.map(async ({ id: projectId }) => {
              const { status } = await getApplicationStatus({
                round,
                projectId,
              });

              statusByProjectId[projectId] = status;
            }),
          );

          const metadataByProjectId = await fetchMetadataForSunnys(projects);

          // Include mock of 10 metrics
          const metricsArray = await fetchImpactMetricsFromCSV({
            projectIds: [
              ...Object.keys(projects),
              ...[
                "id0",
                "id1",
                "id2",
                "id3",
                "id4",
                "id5",
                "id6",
                "id7",
                "id8",
                "id9",
              ],
            ],
          });

          const metricsByProjectId: Record<
            string,
            Partial<OSOMetricsCSV>
          > = indexMetricsByProjectId(metricsArray);

          const projectsResult: Array<
            Attestation & {
              status: ApplicationStatus;
              metrics?: Partial<OSOMetricsCSV>;
              metadata: unknown;
            }
          > = projects.map((project, index) => {
            const { id: projectId } = project;
            const status = statusByProjectId[projectId]!;
            const metrics =
              metricsByProjectId[projectId] ?? metricsByProjectId[`id${index}`];
            const metadata = metadataByProjectId[projectId];

            return {
              ...project,
              metadata,
              metrics,
              status,
            };
          });
          return projectsResult;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: (error as Error).message,
          });
        }
      },
    ),

  // Used for distribution to get the projects' payoutAddress
  // To get this data we need to fetch all projects and their metadata
  payoutAddresses: attestationProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input, ctx }) => {
      return ctx
        .fetchAttestations(["metadata"], {
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

async function fetchMetadataForProjects(
  projects: Attestation[],
  profiles: Attestation[],
) {
  // Fetch metadata for projects - use Promise.all for concurrency
  const metadata = await Promise.all([
    ...projects.map((p) =>
      // Group as projects
      fetchMetadata(p.metadataPtr)
        .then((metadata) => ["projects", [p.id, metadata]])
        .catch(() => []),
    ),
    ...profiles.map((p) =>
      // Group as profiles
      fetchMetadata(p.metadataPtr)
        .then((metadata) => ["profiles", [p.recipient, metadata]])
        .catch(() => []),
    ),
  ]);

  // Build an object from the metadata arrays
  return metadata.reduce(
    (acc, [type, [id, data] = []]) => {
      if (typeof type !== "string" || typeof id !== "string") return acc;
      return {
        ...acc,
        [type]: { ...acc[type as keyof typeof acc], [id]: data },
      };
    },
    { projects: {}, profiles: {} } as {
      projects: Record<string, unknown>;
      profiles: Record<string, unknown>;
    },
  );
}

async function fetchMetadataForSunnys(projects: Attestation[]) {
  const metadataByProjectId: Record<string, unknown> = {};

  await Promise.all(
    projects.map(async ({ metadataPtr, id }) => {
      if (!metadataPtr) return;
      const metadata = await fetchMetadata(metadataPtr);
      metadataByProjectId[id] = metadata;
    }),
  );

  return metadataByProjectId;
}
