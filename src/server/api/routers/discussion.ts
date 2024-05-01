import {
  createTRPCRouter,
  protectedDiscussionProcedure,
  unprotectedDiscussionProcedure,
} from "../trpc";
import { map, omit } from "lodash";
import {
  CreateDiscussionSchema,
  ReplyReqSchema,
  ListReqSchema,
  ReactSchema,
} from "~/features/projects/types/discussion";
import { type PrismaClient } from "@prisma/client";
import { publicClient } from "~/server/publicClient";
import { normalize } from "viem/ens";

async function getENSPayload(walletAddr: `0x${string}`) {
  const ENSName = await publicClient.getEnsName({
    address: walletAddr,
  });
  const ENSAvatar = ENSName
    ? await publicClient.getEnsAvatar({ name: normalize(ENSName) })
    : null;

  return { name: ENSName ?? undefined, avatar: ENSAvatar ?? undefined };
}

async function findOrCreateUser(ctx: { db: PrismaClient }, walletAddr: string) {
  const ENSPayload = await getENSPayload(walletAddr as `0x${string}`);
  const username = ENSPayload.name ?? walletAddr;
  const userInstance = await ctx.db.user.findFirst({
    where: {
      name: username,
    },
  });

  if (userInstance) {
    return userInstance;
  }

  return ctx.db.user.create({
    data: {
      name: username,
      image: ENSPayload.avatar,
    },
  });
}

export const discussionRouter = createTRPCRouter({
  create: protectedDiscussionProcedure
    .input(CreateDiscussionSchema)
    .mutation(async ({ input, ctx }) => {
      const userInstance = await findOrCreateUser(ctx, ctx.session!.user.name!);
      const userId = userInstance.id;

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

  reply: protectedDiscussionProcedure
    .input(ReplyReqSchema)
    .mutation(async ({ input, ctx }) => {
      const userInstance = await findOrCreateUser(ctx, ctx.session!.user.name!);
      const userId = userInstance.id;

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

  get: unprotectedDiscussionProcedure
    .input(ListReqSchema)
    .query(async ({ input, ctx }) => {
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
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        where: { projectId: input.projectId, parentId: null },
        orderBy: {
          createdAt: "desc",
        },
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

  react: protectedDiscussionProcedure
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
