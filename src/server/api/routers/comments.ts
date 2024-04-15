import {
  createTRPCRouter,
  protectedProcedure,
  protectedRoundProcedure,
} from "~/server/api/trpc";
import { CommentSchema } from "~/features/comments/types";
import { fetchApprovedVoter } from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
  create: protectedRoundProcedure
    .input(CommentSchema)
    .mutation(async ({ input: { content, projectId }, ctx }) => {
      const creatorId = String(ctx.session?.user.name);

      if (!(await fetchApprovedVoter(ctx.round, creatorId))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be an approved voter to comment",
        });
      }
      const roundId = ctx.round.id;
      return ctx.db.comment.create({
        data: { content, creatorId, projectId, roundId },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const creatorId = String(ctx.session.user.name);
      return ctx.db.comment.delete({ where: { id, creatorId } });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ input: { id, content }, ctx }) => {
      const creatorId = String(ctx.session.user.name);
      return ctx.db.comment.update({
        where: { id, creatorId },
        data: { content },
      });
    }),
  list: protectedRoundProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input: { projectId }, ctx }) => {
      const roundId = ctx.round.id;
      return ctx.db.comment.findMany({ where: { projectId, roundId } });
    }),
});
