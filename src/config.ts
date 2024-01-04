import * as wagmiChains from "wagmi/chains";
const network: wagmiChains.Chain =
  wagmiChains[process.env.NEXT_PUBLIC_CHAIN_NAME as keyof typeof wagmiChains];

export const config = {
  logoUrl: "",
  pageSize: 3 * 4,
  votingEndsAt: new Date(process.env.NEXT_PUBLIC_VOTING_END_DATE!),
  registrationEndsAt: new Date(process.env.NEXT_PUBLIC_REGISTRATION_END_DATE!),
  reviewEndsAt: new Date(process.env.NEXT_PUBLIC_REVIEW_END_DATE!),
  votingMaxTotal: Number(process.env.NEXT_PUBLIC_MAX_VOTES_TOTAL),
  votingMaxProject: Number(process.env.NEXT_PUBLIC_MAX_VOTES_PROJECT),
  skipApprovedVoterCheck: ["true", "1"].includes(
    process.env.NEXT_PUBLIC_SKIP_APPROVED_VOTER_CHECK!,
  ),
  roundId: process.env.NEXT_PUBLIC_ROUND_ID!,
  admins: (process.env.NEXT_PUBLIC_ADMIN_ADDRESSES ?? "").split(","),
  network,
};

export const metadata = {
  title: "OpenRPGF",
  description: "OpenRPGF: Open-source Retro Public Goods Funding platform",
  url: "https://open-rpgf.vercel.app",
  image: "",
};

export const theme = {
  colorMode: "dark",
};

export const eas = {
  url: process.env.NEXT_PUBLIC_EASSCAN_URL ?? "",
  attesterAddress: process.env.NEXT_PUBLIC_APPROVED_APPLICATIONS_ATTESTER ?? "",

  contracts: {
    eas:
      process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS ??
      "0x4200000000000000000000000000000000000021",
    schemaRegistry:
      process.env.NEXT_PUBLIC_EAS_SCHEMA_REGISTRY_ADDRESS ??
      "0x4200000000000000000000000000000000000020",
  },
  schemas: {
    metadata: process.env.NEXT_PUBLIC_METADATA_SCHEMA!,
    approval: process.env.NEXT_PUBLIC_APPROVAL_SCHEMA!,

    // TODO: remove these
    applicationsSchema: process.env.NEXT_PUBLIC_APPLICATIONS_SCHEMA ?? "",
    approvedApplicationsSchema:
      process.env.NEXT_PUBLIC_APPROVED_APPLICATIONS_SCHEMA ?? "",
    badgeholderAttester: process.env.NEXT_PUBLIC_BADGEHOLDER_ATTESTER ?? "",
    badgeholder: process.env.NEXT_PUBLIC_BADGEHOLDER_SCHEMA ?? "",
    profileSchema: process.env.NEXT_PUBLIC_PROFILE_SCHEMA ?? "",
    listsSchema: process.env.NEXT_PUBLIC_LISTS_SCHEMA ?? "",
  },
};
