import { z } from "zod";

export const DiscussionTypeSchema = z.enum(["concern", "question", "strength"]);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  image: z.string().nullable(),
});

export const ReactSchema = z.object({
  reaction: z.enum(["thumbsUp", "ThumbsDown"]),
  discussionId: z.string().uuid(),
});

export const ReplyReqSchema = z.object({
  isAnonymous: z.boolean(),
  content: z.string().min(1).max(1024),
  discussionId: z.string().uuid(),
  projectId: z.string(),
});
export const ReplyResSchema = z.object({
  user: UserSchema,
  id: z.string(),
  type: z.union([DiscussionTypeSchema, z.null()]),
  isAnonymous: z.boolean(),
  content: z.string(),
  thumbsUp: z.number(),
  thumbsDown: z.number(),
  createdAt: z.date(),
});

export const ListReqSchema = z.object({
  projectId: z.string(),
});

const ListResSchema = z.object({
  user: UserSchema,
  id: z.string(),
  type: z.union([DiscussionTypeSchema, z.null()]),
  isAnonymous: z.boolean(),
  content: z.string(),
  thumbsUp: z.number(),
  thumbsDown: z.number(),
  createdAt: z.date(),
  replies: z.array(ReplyResSchema),
});

export const CreateDiscussionSchema = z.object({
  isAnonymous: z.boolean(),
  type: DiscussionTypeSchema,
  content: z.string().min(1).max(1024),
  projectId: z.string(),
});

export type ListReqType = z.infer<typeof ListReqSchema>;
export type ReactType = z.infer<typeof ReactSchema>;
export type ReplyReqType = z.infer<typeof ReplyReqSchema>;
export type ReplyResType = z.infer<typeof ReplyResSchema>;

export type DiscussionTypes = z.infer<typeof DiscussionTypeSchema>;

export type DiscussionData = z.infer<typeof CreateDiscussionSchema>;
export type Discussion = z.infer<typeof ListResSchema>;
