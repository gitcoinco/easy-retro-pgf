import { createHash } from "crypto";
import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { hashApiKey } from "~/utils/hashApiKey";

const genApiKey = () => hashApiKey(crypto.randomUUID());

export const apiKeysRouter = createTRPCRouter({
  get: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      const creatorId = ctx.session?.user.name!;
      return ctx.db.apiKey.findFirst({ where: { id, creatorId } });
    }),
  list: adminProcedure.query(async ({ ctx }) => {
    const creatorId = ctx.session?.user.name!;
    return ctx.db.apiKey.findMany({ where: { creatorId } });
  }),
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const creatorId = ctx.session?.user.name!;
      return ctx.db.apiKey.delete({ where: { id, creatorId } });
    }),
  create: adminProcedure.mutation(async ({ ctx }) => {
    const key = genApiKey();

    const creatorId = ctx.session?.user.name!;

    await ctx.db.apiKey.create({
      data: { creatorId, key: hashApiKey(key) },
    });

    return { key };
  }),
});
