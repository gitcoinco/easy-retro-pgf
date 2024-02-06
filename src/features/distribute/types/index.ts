import { z } from "zod";

export const DistributionSchema = z.object({
  projectId: z.string(),
  amount: z.number(),
  payoutAddress: z.string(),
});

export type Distribution = z.infer<typeof DistributionSchema>;
