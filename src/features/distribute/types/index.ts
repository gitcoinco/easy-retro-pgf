import { z } from "zod";
import { EthAddressSchema } from "~/features/rounds/types";

export const DistributionSchema = z.object({
  projectId: z.string(),
  amount: z.number().optional(),
  amountPercentage: z.number().optional(),
  payoutAddress: EthAddressSchema,
});

export type Distribution = z.infer<typeof DistributionSchema>;


export const PayoutSchema = DistributionSchema.extend({
  sender: EthAddressSchema,
  amount: z.number(),
});

export type Payout = z.infer<typeof PayoutSchema>;

export const PayoutsTablePropsSchema = z.object({
  distributions: z.array(PayoutSchema),
});

export type PayoutsTableProps = z.infer<typeof PayoutsTablePropsSchema>;

export const MainTablePropsSchema = z.object({
  payoutEventsByTransaction: z.record(z.string(), z.array(PayoutSchema)),
  explorerUrl: z.string().nullable(),
});

export type MainTableProps = z.infer<typeof MainTablePropsSchema>;