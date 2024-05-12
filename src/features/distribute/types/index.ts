import { type Address, isAddress, createPublicClient } from "viem";
import { z } from "zod";
import { normalize } from "viem/ens";
import { http } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(
    `https://eth-mainnet.g.alchemy.com/v2/WCcOSca9z2Qo7wnMJz19Wo_yQr5pqv2k`,
  ),
});

const isENSAddress = async (val: string) => {
  const ensAddress = await publicClient.getEnsAddress({
    name: normalize(val),
  });
  if (ensAddress && ensAddress?.length > 0) return true;
  return false;
};

export const EthAddressSchema = z.custom<string>(
  (val) => isAddress(val as Address),
  "Invalid address",
);
export const EnsAddressSchema = z.custom<string>(
  async (val) => await isENSAddress(val as string),
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
