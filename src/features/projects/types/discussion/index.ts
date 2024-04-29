import { z } from "zod";

export const DiscussionTypeSchema = z.enum(["concern", "question", "strength"]);

export const ListSchema = z.object({
  projectId: z.string(),
});

export const ReactSchema = z.object({
  reaction: z.enum(["thumbsUp", "ThumbsDown"]),
  discussionId: z.string().uuid(),
});

export const ReplySchema = z.object({
  isAnonymous: z.boolean(),
  content: z.string().min(1).max(1024),
  discussionId: z.string().uuid(),
  projectId: z.string(),
});

export const CreateDiscussionSchema = z.object({
  isAnonymous: z.boolean(),
  type: DiscussionTypeSchema,
  content: z.string().min(1).max(1024),
  projectId: z.string(),
});

export type DiscussionType = z.infer<typeof DiscussionTypeSchema>;
export type ListType = z.infer<typeof ListSchema>;
export type ReactType = z.infer<typeof ReactSchema>;
export type ReplyType = z.infer<typeof ReplySchema>;
export type DiscussionData = z.infer<typeof CreateDiscussionSchema>;
