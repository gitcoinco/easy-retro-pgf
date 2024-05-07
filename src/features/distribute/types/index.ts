import { type Address, isAddress } from "viem";
import { z } from "zod";

export const EthAddressSchema = z.custom<string>(
  (val) => isAddress(val as Address),
  "Invalid address",
);

export const DistributionSchema = z.object({
  projectId: z.string(),
  amount: z.string(),
  payoutAddress: EthAddressSchema,
});

export const CalculationSchema = z.object({
  calculation: z.enum(["average", "median", "sum"]),
  threshold: z.number().optional(),
});
export const SettingsSchema = z.object({
  id: z.string().optional(),
  poolId: z.number().optional(),
  config: z.object({
    calculation: CalculationSchema,
  }),
});

export type Distribution = z.infer<typeof DistributionSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
export type Calculation = z.infer<typeof CalculationSchema>;
