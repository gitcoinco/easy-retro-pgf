import { z } from "zod";
import { VoteSchema } from "~/features/ballot/types";

export const ListSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  impactCategory: z.array(z.string()),
  impact: z.object({
    description: z.string(),
    url: z.string().url(),
  }),
  projects: z.array(VoteSchema),
});

export type List = z.infer<typeof ListSchema>;
