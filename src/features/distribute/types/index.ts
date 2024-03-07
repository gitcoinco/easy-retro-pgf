import { z } from "zod";

export const DistributionSchema = z.object({
  projectId: z.string(),
  amount: z.number(),
  payoutAddress: z.string(),
});

export const CalculationSchema = z.object({
  style: z.enum(["custom", "op"]),
  threshold: z.number().optional(),
});
export const SettingsSchema = z.object({
  id: z.string().optional(),
  config: z.object({
    calculation: CalculationSchema,
  }),
});

export type Distribution = z.infer<typeof DistributionSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
