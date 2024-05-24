import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { CommentSchema } from "~/features/comments/types";
import { fetchApprovedVoter } from "~/utils/fetchAttestations";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CommentSchema)
    .mutation(async ({ input: { content, projectId }, ctx }) => {
      const creatorId = String(ctx.session?.user.name);

      if (!(await fetchApprovedVoter(creatorId))) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be an approved voter to comment",
        });
      }
      1;
      return ctx.db.comment.create({
        data: { content, creatorId, projectId },
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
  list: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input: { projectId }, ctx }) => {
      return ctx.db.comment.findMany({ where: { projectId } });
    }),
});
