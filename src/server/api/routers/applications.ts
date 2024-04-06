import { z } from "zod";

import { attestationProcedure, createTRPCRouter } from "~/server/api/trpc";
import { createDataFilter } from "~/utils/fetchAttestations";
import { getContracts } from "~/lib/eas/createEAS";

export const FilterSchema = z.object({
  limit: z.number().default(3 * 8),
  cursor: z.number().default(0),
});
export const applicationsRouter = createTRPCRouter({
  approvals: attestationProcedure
    .input(z.object({ ids: z.array(z.string()).optional() }))
    .query(async ({ input, ctx }) => {
      const contracts = getContracts(String(ctx.round?.network));
      return ctx.fetchAttestations([contracts.schemas.approval], {
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
    .input(z.object({ ids: z.array(z.string()).optional() }))
    .query(async ({ ctx }) => {
      const contracts = getContracts(String(ctx.round?.network));
      return ctx.fetchAttestations([contracts.schemas.metadata], {
        orderBy: [{ time: "desc" }],
        where: {
          AND: [
            createDataFilter("type", "bytes32", "application"),
            createDataFilter("round", "bytes32", String(ctx.round?.id)),
          ],
        },
      });
    }),
});
