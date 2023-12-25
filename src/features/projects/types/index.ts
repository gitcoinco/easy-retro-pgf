import { type Address } from "viem";

export type ProjectMetadata = {
  description: string;
  payoutAddress: Address;
  contributionDescription: string;
  impactDescription: string;
  websiteUrl: string;
  contributionLinks: { description: string; type: string; url: string }[];
  impactMetrics: { description: string; number: number; url: string }[];
  fundingSources: {
    description: string;
    amount: number;
    currency: string;
    type: string;
  }[];
};
