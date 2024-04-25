import * as wagmiChains from "wagmi/chains";

export const metadata = {
  title: "POKTRetroPGF",
  description: "Open-source Retro Public Goods Funding platform",
  url: "https://easy-retro-pgf.vercel.app",
  image: "/api/og",
};

export const config = {
  logoUrl: "/logo.svg",
  pageSize: 3 * 4,
  startsAt: new Date(process.env.NEXT_PUBLIC_START_DATE!),
  registrationEndsAt: new Date(process.env.NEXT_PUBLIC_REGISTRATION_END_DATE!),
  reviewEndsAt: new Date(process.env.NEXT_PUBLIC_REVIEW_END_DATE!),
  votingEndsAt: new Date(process.env.NEXT_PUBLIC_VOTING_END_DATE!),
  resultsAt: new Date(process.env.NEXT_PUBLIC_RESULTS_DATE!),
  votingMaxTotal: Number(process.env.NEXT_PUBLIC_MAX_VOTES_TOTAL),
  votingMaxProject: Number(process.env.NEXT_PUBLIC_MAX_VOTES_PROJECT),
  skipApprovedVoterCheck: ["true", "1"].includes(
    process.env.NEXT_PUBLIC_SKIP_APPROVED_VOTER_CHECK!,
  ),
  tokenName: process.env.NEXT_PUBLIC_TOKEN_NAME!,
  roundId: process.env.NEXT_PUBLIC_ROUND_ID!,
  admins: (process.env.NEXT_PUBLIC_ADMIN_ADDRESSES ?? "").split(
    ",",
  ) as `0x${string}`[],
  network:
    wagmiChains[process.env.NEXT_PUBLIC_CHAIN_NAME as keyof typeof wagmiChains],
};

export const nativeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
export const allo = {
  alloAddress: process.env.NEXT_PUBLIC_ALLO2_ADDRESS as `0x${string}`,
  strategyAddress: process.env.NEXT_PUBLIC_STRATEGY_ADDRESS as `0x${string}`,
  // eslint-disable-next-line
  tokenAddress: (process.env.NEXT_PUBLIC_TOKEN_ADDRESS ||
    nativeToken) as `0x${string}`,
};
export const isNativeToken = allo.tokenAddress === nativeToken;

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
  },
};

export const impactCategories = {
  Protocol: {
    label: "Protocol",
    description:
      "recognising contributions to the POKT stack itself, either through contribution to main code sources such as Morse and Shannon, or through other dependencies and POKT- related repos.",
  },
  Ecosystem: {
    label: "Ecosystem",
    description:
      "recognising tools and applications using or enhancing the experience of working with the POKT stack and may include wallets, explorers or other associated tech. It's all about making an impact on the broader POKT ecosystem through your creations.",
  },
  Adoption: {
    label: "Adoption",
    description:
      "recognising activities that drove awareness and adoption of the POKT Network, whether through discussions, referrals, content or any other meaningful contribution.",
  },
} as const;
