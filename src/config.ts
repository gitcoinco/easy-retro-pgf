import { getAddress, isAddress } from "viem";
import * as wagmiChains from "wagmi/chains";

const admins = {
  "ez-rpgf-filecoin-1": process.env.NEXT_PUBLIC_ADMIN_ADDRESSES,
  // For each new round, add a new admin addresses in .env file
  "ez-rpgf-filecoin-2": process.env.NEXT_PUBLIC_ADMIN_ADDRESSES,
};
export const filecoinRounds = {
  "ez-rpgf-filecoin-1": getAdmins("ez-rpgf-filecoin-1"),
  "ez-rpgf-filecoin-2": getAdmins("ez-rpgf-filecoin-2"),
};

export const roundsMap = {
  "1": "ez-rpgf-filecoin-1",
  "2": "ez-rpgf-filecoin-2",
};

export const previousRoundsMap = {
  "1": "ez-rpgf-filecoin-1",
};

export const roundsStartsAt = {
  "ez-rpgf-filecoin-1": new Date("2024-04-08T12:00:00.000Z"),
  "ez-rpgf-filecoin-2": new Date(process.env.NEXT_PUBLIC_START_DATE!),
};

export const getStartsAt = (roundId: string) => {
  return roundsStartsAt[roundId as keyof typeof roundsStartsAt];
};

function getAdmins(roundId: string) {
  return (
    (admins[roundId as keyof typeof admins] ?? "").split(",") as `0x${string}`[]
  ).map((addr) => {
    console.log(addr);
    if (isAddress(addr)) return getAddress(addr);
    throw new Error("Invalid admin address");
  });
}

export const metadata = {
  title: "FIL RetroPGF",
  description: "Filecoin Retro Public Goods",
  url: "https://ezrpgf-filecoin.vercel.app",
  image: "/filrpgf.jpg",
};

export const config = {
  logoUrl: "https://filecoin.io/images/filecoin-logo.svg",
  pageSize: 3 * 500,
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
  admins: getAdmins(process.env.NEXT_PUBLIC_ROUND_ID!),

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
  colorMode: "light",
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

export const OSO = {
  url: process.env.NEXT_PUBLIC_OSO_URL ?? "",
  apiKey: process.env.OSO_API_KEY ?? "",
};

export const impactCategories = {
  INFRASTRUCTURE: { label: "Infrastructure & Dependencies" },
  TOOLING: { label: "Tooling & Utilities" },
  COMMUNITY_EDUCATION: { label: "Education & Outreach" },
  RESEARCH_AND_DEVELOPMENT: { label: "Protocol Research & Development" },
  GOVERNANCE: { label: "Collective Governance" },
  END_USER_EXPERIENCE: { label: "Products & End User UX" },
} as const;
