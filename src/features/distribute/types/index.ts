import { type Address, isAddress } from "viem";
import { z } from "zod";

export const EthAddressSchema = z.custom<string>(
  (val) =>
    (val as string)
      .split(",")
      .map((address) => address.trim())
      .every((address) => isAddress(address as Address)) ||
    isAddress(val as Address),
  "Invalid address",
);

export const DistributionSchema = z.object({
  projectId: z.string(),
  amount: z.number(),
  payoutAddress: EthAddressSchema,
});

export const CalculationSchema = z.object({
  style: z.enum(["custom", "op"]),
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
