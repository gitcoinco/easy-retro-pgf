import { PubKey } from "maci-domainobjs";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchUser } from "~/utils/fetchUser";

export const maciRouter = createTRPCRouter({
  user: publicProcedure
    .input(z.object({ publicKey: z.string() }))
    .query(async ({ input }) =>
      fetchUser(PubKey.deserialize(input.publicKey).rawPubKey),
    ),
});
