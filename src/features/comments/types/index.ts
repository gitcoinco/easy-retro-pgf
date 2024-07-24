import { z } from "zod";

export const CommentSchema = z.object({
  content: z.string().min(2),
  projectId: z.string(),
});

export const CommentUpdateSchema = z.object({
  id: z.string(),
  content: z.string().min(2),
});
