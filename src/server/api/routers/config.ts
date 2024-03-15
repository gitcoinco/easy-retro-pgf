import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { type PrismaClient } from ".prisma/client";
import { type Settings, SettingsSchema } from "~/features/distribute/types";

export async function getSettings(db: PrismaClient) {
  return (await db.settings.findFirst()) as unknown as Settings;
}

export const configRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    return await getSettings(ctx.db);
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
    .input(z.object({ poolId: z.number() }))
    .mutation(async ({ input: { poolId }, ctx }) => {
      const existing = await getSettings(ctx.db);
      return existing
        ? ctx.db.settings.update({
            where: { id: existing.id },
            data: { poolId },
          })
        : ctx.db.settings.create({ data: { poolId } });
    }),
});
