import { PubKey } from "maci-domainobjs";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fetchUser } from "~/utils/fetchUser";
import {fetchPoll} from "~/utils/fetchPoll";

export const maciRouter = createTRPCRouter({
  user: publicProcedure
    .input(z.object({ publicKey: z.string() }))
    .query(async ({ input }) =>
      fetchUser(PubKey.deserialize(input.publicKey).rawPubKey),
    ),
    poll: publicProcedure
    .input(z.object({ pollId: z.string() }))
    .query(async ({input}) =>
      fetchPoll(input.pollId),
    ),
});
