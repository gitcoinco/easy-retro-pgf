import { type Address, isAddress } from "viem";
import { z } from "zod";

const isENSAddress = (val: Address): boolean => {
  // Perform your ENS address validation here
  // You can use a regular expression or any other method
  // to check the format and validity of the ENS address
  return false; // Replace with your validation logic
};

export const EthAddressSchema = z.custom<string>((val) => {
  const isValidEthAddress = isAddress(val as Address);
  const isValidENSAddress = isENSAddress(val as Address);
  return isValidEthAddress || isValidENSAddress;
}, "Invalid address");

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
