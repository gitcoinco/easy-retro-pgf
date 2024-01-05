import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchAttestations, createDataFilter } from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { config, eas } from "~/config";

export const SortEnum = z.enum(["shuffle", "name"]).optional();
export const TypeEnum = z
  .enum(["application", "profile", "list", ""])
  .optional();

export const FilterSchema = z.object({
  limit: z.number().default(3 * 8),
  cursor: z.number().default(0),
  seed: z.number().default(0),
});

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
    }).then((attestations) => {
      const approvedIds = attestations.map(({ refUID }) => refUID);
      return { count: approvedIds.length };
    });
  }),
  get: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        approvedId: z.string().optional(),
      }),
    )
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
      where: { attester: { in: config.admins } },
    }).then((attestations) => {
      const approvedIds = attestations.map(({ refUID }) => refUID);
      return fetchAttestations([eas.schemas.metadata], {
        take: input.limit,
        skip: input.cursor * input.limit,
        where: { id: { in: approvedIds } },
      });
    });
  }),
});
