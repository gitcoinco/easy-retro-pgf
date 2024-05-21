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
import { type Reaction, type PrismaClient } from "@prisma/client";
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
      walletAddress: walletAddr,
    },
  });

  if (userInstance) {
    return userInstance;
  }

  return ctx.db.user.create({
    data: {
      name: username,
      walletAddress: walletAddr,
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
          createdAt: true,
          ...(input.isAnonymous
            ? null
            : { user: { select: { id: true, name: true, image: true } } }),
          reactions: {
            select: {
              user: {
                select: {
                  id: true,
                  walletAddress: true,
                },
              },
              reaction: true,
            },
          },
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
          createdAt: true,
          ...(input.isAnonymous
            ? null
            : { user: { select: { id: true, name: true, image: true } } }),
          reactions: {
            select: {
              user: {
                select: {
                  id: true,
                  walletAddress: true,
                },
              },
              reaction: true,
            },
          },
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
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          replies: {
            select: {
              id: true,
              content: true,
              isAnonymous: true,
              thumbsUp: true,
              thumbsDown: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              reactions: {
                select: {
                  user: {
                    select: {
                      id: true,
                      walletAddress: true,
                    },
                  },
                  reaction: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          reactions: {
            select: {
              user: {
                select: {
                  id: true,
                  walletAddress: true,
                },
              },
              reaction: true,
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
      const discussionId = input.discussionId;
      const userInstance = await findOrCreateUser(ctx, ctx.session!.user.name!);
      const userId = userInstance.id;
      const reactionInstance = await ctx.db.discussionReaction.findFirst({
        where: {
          discussionId: discussionId,
          userId: userId,
        },
      });

      // reacted before, need to delete the instance and decrease the counter
      if (reactionInstance) {
        const [_deletedReaction, updatedDiscussion] = await ctx.db.$transaction(
          [
            ctx.db.discussionReaction.delete({
              where: {
                userId_discussionId: {
                  discussionId: discussionId,
                  userId: userId,
                },
              },
            }),
            ctx.db.discussion.update({
              where: {
                id: discussionId,
              },
              data: {
                [reactionInstance.reaction]: { decrement: 1 },
              },
              select: {
                id: true,
                thumbsUp: true,
                thumbsDown: true,
                reactions: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        walletAddress: true,
                      },
                    },
                    reaction: true,
                  },
                },
              },
            }),
          ],
        );

        // return if more operation does not needed
        if (reactionInstance.reaction === input.reaction) {
          return updatedDiscussion;
        }
      }

      // did not react before or react by other reactions, need to create the instance and increase the counter
      const [_createdReaction, updatedDiscussion] = await ctx.db.$transaction([
        ctx.db.discussionReaction.create({
          data: {
            userId: userId,
            discussionId: discussionId,
            reaction: input.reaction as Reaction,
          },
        }),
        ctx.db.discussion.update({
          where: {
            id: discussionId,
          },
          data: {
            [input.reaction]: { increment: 1 },
          },
          select: {
            id: true,
            thumbsUp: true,
            thumbsDown: true,
            reactions: {
              select: {
                user: {
                  select: {
                    id: true,
                    walletAddress: true,
                  },
                },
                reaction: true,
              },
            },
          },
        }),
      ]);

      return updatedDiscussion;
    }),
});
