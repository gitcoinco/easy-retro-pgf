import {
  roundProcedure,
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { convert } from "url-slug";
import { RoundNameSchema, RoundSchema } from "~/features/rounds/types";

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

      return ctx.db.round
        .create({
          data: {
            name,
            domain,
            creatorId,
            startsAt: new Date(),
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
    return ctx.db.round.findMany({});
  }),
});
