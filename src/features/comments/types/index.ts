import { z } from "zod";

export const CommentSchema = z.object({
  content: z.string().min(2),
  projectId: z.string(),
});
