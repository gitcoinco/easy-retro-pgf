import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const configRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    return ctx.db.settings.findFirst();
  }),
  set: adminProcedure
    .input(
      z.object({
        id: z.string().optional(),
        config: z.object({
          calculation: z.object({
            style: z.enum(["custom", "op"]),
            threshold: z.number().optional(),
          }),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const config = JSON.stringify(input.config);
      return ctx.db.settings.upsert({
        where: { id: input.id },
        update: { config },
        create: { config },
      });
    }),
});
