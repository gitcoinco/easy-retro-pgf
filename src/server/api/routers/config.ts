import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import {
  type Settings,
  SettingsSchema,
  CalculationSchema,
} from "~/features/distribute/types";
import { type PrismaClient } from "@prisma/client";

export async function getSettings(db: PrismaClient) {
  return db.settings.findFirst() as unknown as Promise<Settings>;
}

export const configRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    return getSettings(ctx.db);
  }),

  set: adminProcedure
    .input(SettingsSchema)
    .mutation(async ({ input: { config }, ctx }) => {
      const existing = await getSettings(ctx.db);
      return existing
        ? ctx.db.settings.update({
            where: { id: existing.id },
            data: { config },
          })
        : ctx.db.settings.create({ data: { config } });
    }),

  setPoolId: adminProcedure
    .input(
      z.object({
        poolId: z.number(),
        config: z.object({
          calculation: CalculationSchema,
        }),
      }),
    )
    .mutation(async ({ input: { poolId, config }, ctx }) => {
      const existing = await getSettings(ctx.db);
      return existing
        ? ctx.db.settings.update({
            where: { id: existing.id },
            data: { poolId },
          })
        : ctx.db.settings.create({ data: { poolId, config } });
    }),
});
