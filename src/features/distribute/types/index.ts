import { type Address, isAddress } from "viem";
import { z } from "zod";
import { resolveENSAddress } from "~/utils/resolveENSAddress";

export const EnsAddressSchema = z.string().refine(async (val) => {
  try {
    await resolveENSAddress(val);
    return true;
  } catch {
    return false;
  }
}, "Invalid address");

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
