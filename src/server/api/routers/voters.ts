import { z } from "zod";

import { attestationProcedure, createTRPCRouter } from "~/server/api/trpc";
import {
  createDataFilter,
  fetchApprovedVoter,
} from "~/utils/fetchAttestations";
import { eas } from "~/config";

export const votersRouter = createTRPCRouter({
  approved: attestationProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input, ctx }) => {
      return fetchApprovedVoter(ctx.round!, input.address);
    }),
  list: attestationProcedure.query(async ({ ctx }) => {
    return ctx.fetchAttestations([eas.schemas.approval], {
      where: {
        AND: [
          createDataFilter("type", "bytes32", "voter"),
          createDataFilter("round", "bytes32", String(ctx.round?.id)),
        ],
      },
    });
  }),
});
