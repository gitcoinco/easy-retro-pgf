import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type AttestationWithMetadata,
  fetchAttestations,
  parseDecodedJSON,
} from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { type Attestation } from "~/features/projects/types";
import { eas } from "~/config";

export const SortEnum = z.enum(["shuffle", "name"]).optional();
export const TypeEnum = z
  .enum(["application", "profile", "list", ""])
  .optional();

export const FilterSchema = z.object({
  // search: z.string().optional(),
  limit: z.number().default(3 * 8),
  cursor: z.number().default(0),
  seed: z.number().default(0),
  // sort: SortEnum,
  // type: TypeEnum,
});

export const projectsRouter = createTRPCRouter({
  count: publicProcedure.query(async ({}) => {
    return fetchAttestations([eas.schemas.approvedApplicationsSchema], {
      where: { attester: { in: eas.admins } },
    })
      .then(filterApproved)
      .then((attestations) => {
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
    .query(async ({ input }) => {
      let id = input.id;
      // OP RPGF3 uses the approvedApplications ID rather than the applications ID - this is required for RPGF3 lists to work
      if (input.approvedId) {
        id = await fetchAttestations([eas.schemas.approvedApplicationsSchema], {
          where: { id: { equals: input.approvedId } },
        }).then(([attestation]) => attestation?.refUID);
      }

      if (!id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return fetchAttestations([eas.schemas.applicationsSchema], {
        where: { id: { equals: id } },
      }).then(([attestation]) => {
        if (!attestation) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return attestation ? parseProject(attestation) : undefined;
      });
    }),
  query: publicProcedure.input(FilterSchema).query(async ({ input }) => {
    return fetchAttestations([eas.schemas.approvedApplicationsSchema], {
      where: { attester: { in: eas.admins } },
    })
      .then(filterApproved)
      .then((attestations) => {
        const approvedIds = attestations.map(({ refUID }) => refUID);

        return fetchAttestations([eas.schemas.applicationsSchema], {
          take: input.limit,
          skip: input.cursor * input.limit,
          where: { id: { in: approvedIds } },
        }).then((attestations) => attestations.map(parseProject));
      });
  }),
});

function filterApproved(attestations: AttestationWithMetadata[]) {
  return attestations.filter(
    ({ decodedDataJson }) =>
      parseDecodedJSON<{ boolApproved: boolean }>(decodedDataJson)
        ?.boolApproved,
  );
}

function parseProject({
  id,
  attester,
  decodedDataJson,
}: AttestationWithMetadata): Attestation {
  const { displayName: name, applicationMetadataPtr: metadataPtr } =
    parseDecodedJSON<{
      displayName: string;
      applicationMetadataPtr: string;
    }>(decodedDataJson);

  return { id, attester, name, metadataPtr };
}
