import {
  roundProcedure,
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { convert } from "url-slug";
import { RoundNameSchema, RoundSchema } from "~/features/rounds/types";
import { addDays, addMonths } from "date-fns";

export const roundsRouter = createTRPCRouter({
  get: roundProcedure
    .input(z.object({ domain: z.string() }))
    .query(async ({ input: { domain }, ctx }) => {
      return ctx.db.round.findFirst({ where: { domain } });
    }),
  create: protectedProcedure
    .input(z.object({ name: RoundNameSchema }))
    .mutation(async ({ input: { name }, ctx }) => {
      const domain = convert(name);

      const creatorId = ctx.session.user.name!;

      const now = new Date();
      return ctx.db.round
        .create({
          data: {
            name,
            domain,
            creatorId,
            startsAt: now,
            reviewAt: addDays(now, 14),
            votingAt: addMonths(now, 1),
            resultAt: addMonths(addDays(now, 7), 1),
            payoutAt: addMonths(addDays(now, 7), 1),
            admins: [creatorId],
          },
        })
        .then((r) => r as RoundSchema | undefined);
    }),

  update: adminProcedure
    .input(RoundSchema.partial())
    .mutation(async ({ input: { id, ...input }, ctx }) => {
      return ctx.db.round.update({ where: { id }, data: input });
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const creatorId = ctx.session.user.name!;

    return ctx.db.round.findMany({ where: { creatorId } });
  }),
});
