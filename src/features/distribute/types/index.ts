import { z } from "zod";
import { EthAddressSchema } from "~/features/rounds/types";

export const DistributionSchema = z.object({
  projectId: z.string(),
  amount: z.string(),
  payoutAddress: EthAddressSchema,
});

export type Distribution = z.infer<typeof DistributionSchema>;
