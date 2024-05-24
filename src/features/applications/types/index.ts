import { z } from "zod";
import { EthAddressSchema } from "~/features/voters/types";
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
  websiteUrl: z
    .string()
    .min(1)
    .transform((url) => {
      // Automatically prepend "https://" if it's missing
      return /^(http:\/\/|https:\/\/)/i.test(url) ? url : `https://${url}`;
    }),
  payoutAddress: EthAddressSchema,
  contributionDescription: z.string().min(3),
  impactDescription: z.string().min(3),
  impactCategory: z.array(z.string()).min(1),
  contributionLinks: z
    .array(
      z.object({
        description: z.string().min(3),
        type: z.nativeEnum(reverseKeys(contributionTypes)),
        url: z
          .string()
          .min(1)
          .transform((url) => {
            // Automatically prepend "https://" if it's missing
            return /^(http:\/\/|https:\/\/)/i.test(url)
              ? url
              : `https://${url}`;
          }),
      }),
    )
    .min(1),
  impactMetrics: z
    .array(
      z.object({
        description: z.string().min(3),
        url: z
          .string()
          .min(1)
          .transform((url) => {
            // Automatically prepend "https://" if it's missing
            return /^(http:\/\/|https:\/\/)/i.test(url)
              ? url
              : `https://${url}`;
          }),
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
    .default([]),
});

export type Application = z.infer<typeof ApplicationSchema>;
