import { z } from "zod";
import { EthAddressSchema } from "~/features/distribute/types";
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

export const booleanOptions = {
  YES: "Yes",
  NO: "No",
} as const;

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

export const fundingAmountTypes = {
  HUGE: "Greater than $1M USD",
  ALOT: "1M - 500K USD",
  LOT: "500K - 250K USD",
  MLOT: "250K - 100K USD",
  LITTLE: "100K - 10K USD",
  SMALL: "10K-1K USD",
  TINY: "Less than 1K USD",
} as const;

export const ApplicationSchema = z.object({
  // name: z.string().min(3),
  bio: z.string().min(3),
  websiteUrl: z.string().url().min(1),
  payoutAddress: z.string().optional(),
  githubProjectLink: z.string().url().includes("https://github.com/").min(20),

  contributionDescription: z.string().min(3),
  impactDescription: z.string().min(3),
  impactCategory: z.array(z.string()).min(1).max(1),
  teamDescription: z.string().min(3),
  twitterPost: z.string().optional(),
  contributionLinks: z
    .array(
      z.object({
        description: z.string().min(3),
        type: z.nativeEnum(reverseKeys(contributionTypes)),
        url: z.string().url(),
      }),
    )
    .min(1),
  categoryQuestions: z.record(z.string(), z.record(z.string(), z.string())),
  encryptedData: z.object({ iv: z.string(), data: z.string() }).optional(),
});

export const ApplicationVerificationSchema = z.object({
  name: z.string().min(3),
  POCName: z.string().min(3),
  projectEmail: z.string().email(),
  projectPhysicalAddress: z.string().min(3),
  additionalPOC: z.string().optional(),
  fundingSources: z
    .array(
      z.object({
        description: z.string().min(1),
        range: z.string().min(1),
      }),
    )
    .optional(),
  previousApplication: z
    .object({
      applied: z.string(),
      link: z.string().optional(),
    })
    .optional(),
});

export type Application = z.infer<typeof ApplicationSchema>;
export type ApplicationVerification = z.infer<
  typeof ApplicationVerificationSchema
>;
export type ApplicationWithVerificationData = Application & {
  applicationVerificationData: ApplicationVerification;
};
