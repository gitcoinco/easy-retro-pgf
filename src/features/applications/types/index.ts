import { z } from "zod";
import {
  EthAddressSchema,
  EnsAddressSchema,
} from "~/features/distribute/types";
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
  POKT_DAO_Grant: "POKT DAO Grant",
  External_funding: "External funding",
  REVENUE: "Revenue",
  OTHER: "Other",
} as const;

export const socialMediaTypes = {
  Github: "Github",
  Twitter: "Twitter",
  Discord: "Discord",
  Telegram: "Telegram",
} as const;

export const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

export const ApplicationSchema = z.object({
  name: z.string().min(3),
  bio: z.string().min(3),
  websiteUrl: z.string()
    .min(1, "Website URL is required")
    .refine((data: string) => urlRegex.test(data), {
      message: "Invalid URL format. URL must be a valid web address with or without 'https://'.",
    }),
  wPOKTReceivingAddress: z.union([EthAddressSchema, EnsAddressSchema]),
  arbReceivingAddress: z.union([EthAddressSchema, EnsAddressSchema]),
  opReceivingAddress: z.union([EthAddressSchema, EnsAddressSchema]),
  contributionDescription: z.string().min(3),
  impactDescription: z.string().min(3),
  impactCategory: z.array(z.string()).min(1),
  contributionLinks: z
    .array(
      z.object({
        description: z.string().min(3),
        type: z.nativeEnum(reverseKeys(contributionTypes)),
        url: z.string()
        .min(1, "Website URL is required")
        .refine((data: string) => urlRegex.test(data), {
          message: "Invalid URL format. URL must be a valid web address with or without 'https://'.",
        }),
      }),
    )
    .min(1),

  impactMetrics: z
    .array(
      z.object({
        description: z.string().min(3),
        url: z.string()
            .min(1, "URL is required")
            .refine((data: string) => urlRegex.test(data), {
                message: "Invalid URL format. URL must be a valid address with or without 'https://'.",
            }),
        number: z.number(),
      }),
    )
    .min(1),
  fundingSources: z.array(
    z.object({
      description: z.string().min(3),
      amount: z.number(),
      currency: z.string().min(3).max(6),
      type: z.nativeEnum(reverseKeys(fundingSourceTypes)),
    }),
  ),
  socialMedias: z.array(
    z.object({
      url: z.string().min(1),
      type: z.nativeEnum(reverseKeys(socialMediaTypes)),
    }),
  ),
  isDAOVoters: z.boolean(),
});

export type Application = z.infer<typeof ApplicationSchema>;

export const resolveENSSchema = z.object({address: z.string().min(1)});
export type resolveENS = z.infer<typeof resolveENSSchema>;
