import { createTRPCRouter, discussionProcedure } from "../trpc";
import { z } from "zod";
import { map, omit } from "lodash";
import {
  CreateDiscussionSchema,
  ReplySchema,
  ListSchema,
  ReactSchema,
} from "~/features/projects/types/discussion";

export const discussionRouter = createTRPCRouter({
  create: discussionProcedure
    .input(CreateDiscussionSchema)
    .mutation(async ({ input, ctx }) => {
      const userId: string = ctx.session!.user.id;

      return await ctx.db.discussion.create({
        data: {
          isAnonymous: input.isAnonymous,
          type: input.type,
          content: input.content,
          projectId: input.projectId,
          userId: userId,
        },

        select: {
          id: true,
          content: true,
          type: true,
          thumbsUp: true,
          thumbsDown: true,
          isAnonymous: true,
          ...(input.isAnonymous
            ? null
            : { user: { select: { id: true, name: true, image: true } } }),
          createdAt: true,
        },
      });
    }),

  reply: discussionProcedure
    .input(ReplySchema)
    .mutation(async ({ input, ctx }) => {
      const userId: string = ctx.session!.user.id;

      return await ctx.db.discussion.create({
        data: {
          parentId: input.discussionId,
          content: input.content,
          isAnonymous: input.isAnonymous,
          projectId: input.projectId,
          userId: userId,
        },
        select: {
          id: true,
          content: true,
          type: true,
          thumbsUp: true,
          thumbsDown: true,
          isAnonymous: true,
          ...(input.isAnonymous
            ? null
            : { user: { select: { id: true, name: true, image: true } } }),
          createdAt: true,
        },
      });
    }),

  get: discussionProcedure.input(ListSchema).query(async ({ input, ctx }) => {
    const discussions = await ctx.db.discussion.findMany({
      select: {
        id: true,
        content: true,
        type: true,
        isAnonymous: true,
        thumbsUp: true,
        thumbsDown: true,
        createdAt: true,
        user: { select: { id: true, name: true, image: true } },
        replies: {
          select: {
            id: true,
            content: true,
            isAnonymous: true,
            thumbsUp: true,
            thumbsDown: true,
            createdAt: true,
            user: { select: { id: true, name: true, image: true } },
          },
        },
      },
      where: { projectId: input.projectId, parentId: null },
    });

    return map(discussions, (discussion) => {
      const updatedReplies = map(discussion.replies, (reply) => {
        if (reply.isAnonymous) {
          return omit(reply, ["user"]);
        }

        return reply;
      });

      (discussion.replies as unknown as Array<unknown>) = updatedReplies;

      if (discussion.isAnonymous) {
        return omit(discussion, ["user"]);
      }

      return discussion;
    });
  }),

  react: discussionProcedure
    .input(ReactSchema)
    .mutation(async ({ ctx, input }) => {
      const isThumbsUp = input.reaction === "thumbsUp" ? true : false;

      return await ctx.db.discussion.update({
        where: {
          id: input.discussionId,
        },
        data: {
          ...(isThumbsUp
            ? { thumbsUp: { increment: 1 } }
            : { thumbsDown: { increment: 1 } }),
        },
        select: {
          id: true,
          thumbsUp: true,
          thumbsDown: true,
        },
      });
    }),
});
