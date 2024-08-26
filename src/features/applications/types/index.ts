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

export const SunnyAwardsSchema = z.object({
  projectType: z.enum(["creator", "app", "other"]),
  avatarUrl: z.string().url(),
  coverImageUrl: z.string().url(),
  category: z.string().nullable().optional(),
  categoryDetails: z.string().optional(),

  contracts: z
    .array(
      z.object({
        chainId: z.string(),
        address: z.string(),
      }),
    )
    .optional(),

  mintingWalletAddress: z.string().optional(),

  projectReferences: z.object({
    charmverseId: z.string(),
    agoraProjectRefUID: z.string().optional(),
  }),
});

export const ApplicationSchema = z.object({
  name: z.string().min(3),
  bio: z.string().min(3),
  websiteUrl: z.string().url().min(1),
  payoutAddress: EthAddressSchema,
  contributionDescription: z.string().min(3),
  impactDescription: z.string().min(3),
  impactCategory: z.array(z.string()).default([]),
  contributionLinks: z
    .array(
      z.object({
        description: z.string().min(3),
        type: z.nativeEnum(reverseKeys(contributionTypes)),
        url: z.string().url(),
      }),
    )
    .min(1),
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
  sunnyAwards: SunnyAwardsSchema.optional(),
});

export type Application = z.infer<typeof ApplicationSchema>;
