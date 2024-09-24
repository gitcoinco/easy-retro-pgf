import { z } from "zod";

import { attestationProcedure, createTRPCRouter } from "~/server/api/trpc";
import { createDataFilter } from "~/utils/fetchAttestations";

export const FilterSchema = z.object({
  limit: z.number().default(3 * 8),
  cursor: z.number().default(0),
});
export const applicationsRouter = createTRPCRouter({
  approvals: attestationProcedure
    .input(z.object({ ids: z.array(z.string()).optional() }))
    .query(async ({ input, ctx }) => {
      return ctx.fetchAttestations(["approval"], {
        where: {
          attester: { in: ctx.round?.admins },
          refUID: input.ids ? { in: input.ids } : undefined,
          AND: [
            createDataFilter("type", "bytes32", "application"),
            createDataFilter("round", "bytes32", String(ctx.round?.id)),
          ],
        },
      });
    }),
  list: attestationProcedure
    .input(z.object({ attester: z.string().optional() }))
    .query(async ({ input: { attester }, ctx }) => {
      return ctx.fetchAttestations(["metadata"], {
        orderBy: [{ time: "desc" }],
        where: {
          AND: [
            attester ? { attester: { equals: attester } } : {},
            createDataFilter("type", "bytes32", "application"),
            createDataFilter("round", "bytes32", String(ctx.round?.id)),
          ],
        },
      });
    }),
});
