import { z } from "zod";
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
  payoutAddress: z.string().startsWith("0x"),
  contributionDescription: z.string(),
  impactDescription: z.string(),
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
        description: z.string(),
        amount: z.number(),
        currency: z.string().min(3).max(4),
        type: z.nativeEnum(reverseKeys(fundingSourceTypes)),
      }),
    )
    .min(1),
});

export type Application = z.infer<typeof ApplicationSchema>;
