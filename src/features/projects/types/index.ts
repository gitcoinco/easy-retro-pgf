import { type Address } from "viem";

export type Attestation = {
  id: string;
  name: string;
  attester: Address;
  metadataPtr: string;
};

export type ProjectMetadata = {
  bio: string;
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
