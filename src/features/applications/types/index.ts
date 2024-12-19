import { z } from "zod";
import { EthAddressSchema } from "~/features/rounds/types";
import { reverseKeys } from "~/utils/reverseKeys";

export const MetadataSchema = z.object({
  name: z.string().min(3),
  metadataType: z.enum(["1"]),
  metadataPtr: z.string().min(3),
});

export const ProfileSchema = z.object({
  name: z.string().min(3),
  profileImageUrl: z.string(),
  bannerImageUrl: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const contributionTypes = {
  CONTRACT_ADDRESS: "Contract address",
  GITHUB_REPO: "Github repo",
  OTHER: "Other",
} as const;

export const fundingSourceTypes = {
  GOVERNANCE_FUND: "Governance fund",
  PARTNER_FUND: "Partner fund",
  REVENUE: "Revenue",
  OTHER: "Other",
} as const;

export const ApplicationSchema = z.object({
  name: z.string().min(3),
  bio: z.string().min(3),
  websiteUrl: z.string().url().min(1),
  payoutAddress: EthAddressSchema,
  impactDescription: z.string().min(3),
  impactCategory: z.array(z.string()).default([]),
  impactMetrics: z
    .array(
      z.object({
        description: z.string().min(3),
        url: z.string().url(),
        number: z.number(),
      }),
    )
    .min(1),
  fundingSources: z
    .array(
      z.object({
        description: z.string().min(3),
        amount: z.number(),
        currency: z.string().min(3).max(4),
        type: z.nativeEnum(reverseKeys(fundingSourceTypes)),
      }),
    )
    .min(1),
});

export const DripsApplicationSchema = z.object({
  githubUrl: z.string().includes("https://github.com/"),
  ...ApplicationSchema.shape,
});

export type Application = z.infer<typeof ApplicationSchema>;

export type DripsApplication = z.infer<typeof DripsApplicationSchema>;
