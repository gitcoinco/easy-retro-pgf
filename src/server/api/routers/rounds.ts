import { z } from "zod";
import { convert } from "url-slug";
import { addDays, addMonths } from "date-fns";
import {
  roundProcedure,
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { RoundNameSchema, RoundSchema } from "~/features/rounds/types";
import { networks } from "~/config";
import { type PrismaClient } from "@prisma/client";

export const roundsRouter = createTRPCRouter({
  get: roundProcedure
    .input(z.object({ domain: z.string() }))
    .query(async ({ input: { domain }, ctx }) => {
      return (await ctx.db.round.findFirst({
        where: { domain },
      })) as RoundSchema | null;
    }),
  create: protectedProcedure
    .input(z.object({ name: RoundNameSchema }))
    .mutation(async ({ input: { name }, ctx }) => {
      const domain = await createDomain(name, ctx.db);

      const creatorId = ctx.session.user.name!;

      const now = new Date();
      return ctx.db.round
        .create({
          data: {
            name,
            domain,
            creatorId,
            startsAt: addDays(now, 7),
            reviewAt: addDays(now, 14),
            votingAt: addMonths(now, 1),
            resultAt: addMonths(addDays(now, 7), 1),
            payoutAt: addMonths(addDays(now, 7), 1),
            maxVotesProject: 10_000,
            maxVotesTotal: 100_000,
            admins: [creatorId],
            network: networks.optimismSepolia,
            calculationType: "average",
          },
        })
        .then((r) => r as RoundSchema | undefined);
    }),

  update: adminProcedure
    .input(RoundSchema.partial())
    .mutation(async ({ input, ctx }) => {
      return ctx.db.round.update({ where: { id: ctx.round?.id }, data: input });
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const creatorId = ctx.session.user.name!;

    return ctx.db.round.findMany({ where: { admins: { has: creatorId } } });
  }),
});

const blacklistedDomains = ["api", "app", "create-round"];
async function createDomain(name: string, db: PrismaClient) {
  let domain = convert(name);
  // If domain already exist or one of the not allowed - append a random string
  if (
    blacklistedDomains.includes(domain) ||
    (await db.round.findFirst({ where: { domain } }))
  ) {
    domain = domain + `_${Math.random().toString(16).slice(2, 5)}`;
  }
  return domain;
}
