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

export const impactCategories = {
  INFRASTRUCTURE: { label: "Infrastructure & Dependencies" },
  TOOLING: { label: "Tooling & Utilities" },
  COMMUNITY_EDUCATION: { label: "Education & Outreach" },
  RESEARCH_AND_DEVELOPMENT: { label: "Protocol Research & Development" },
  GOVERNANCE: { label: "Collective Governance" },
  END_USER_EXPERIENCE: { label: "Products & End User UX" },
} as const;

// Define the impact categories and their specific questions
export const impactCategoryQuestions = {
  "Infrastructure & Dependencies": {
    questions: [
      "Please include your oso_name, if you don’t have one please follow this process [link] to get it.",
      "Name the top 5 high-impact projects dependent on your library/repository.",
      "What is the percentage of Filecoin users (or percentage of the network) that run on your implementation?",
      "How has your project contributed to growing the Filecoin economy? For example, what volume of FIL-denominated transactions does your library support? [If possible, provide a numerical estimate]",
      "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
    ],
  },
  "Tooling & Utilities": {
    questions: [
      "Please include your oso_name, if you don’t have one please follow this process [link] to get it.",
      "How many FVM projects are dependent on your project? Name the top 5 high-impact projects dependent on your tool.",
      "How many times has an SDK or package developed by your project been downloaded?",
      "How has your project contributed to growing the Filecoin economy? For example, what volume of FIL-denominated transactions has it supported? [If possible, provide a numerical estimate]",
      "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
    ],
  },
  "Education & Outreach": {
    questions: [
      "What is the increase in the number of first-time Filecoin addresses as a result of your educational content?",
      "What is the total number of impressions your content has received? What is the feedback score you have received?",
      "What is the number of people graduating from your program / What is the number of people who attended your event?",
      "What is the increase in the number of active developer users as a result of your educational content?",
      "How has your project contributed to growing the Filecoin economy? For example, what volume of FIL-denominated transactions has it enabled. [If possible, provide a numerical estimate and a link]",
      "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
    ],
  },
  "Protocol Research & Development": {
    questions: [
      "What is the number of projects that are dependent on the core Filecoin Protocol Code/Mechanisms that your project has built?",
      "How has your research improved usability or infrastructure, for example, the response to a public Filecoin Mainnet RPC call?",
      "What is the increase in efficiency for storage data as a result of your work? For example, a reduction in sealing costs.",
      "How much improvement in system performance has Filecoin seen as a result of your work?",
      "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
    ],
  },
  "Collective Governance": {
    questions: [
      "How has your project made governance more accessible to more members of the Filecoin ecosystem?",
      "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
    ],
  },
  "Products & End User UX": {
    questions: [
      "Please share 1-3 user case studies.",
      "What is the increase in Filecoin wallet interactions during the impact window as a result of your project?",
      "What is the average number of users retained upon interacting with your application for the first time?",
      "What is the number of returning unique transacting addresses per project?",
      "What is the increase in interactions with a project derived from this contribution?",
      "What is the growth in the number of monthly active addresses interacting with your project?",
      "What is the number of new addresses that have been funded as a result of a contribution?",
      "How has your project contributed to growing the Filecoin economy? For example, what volume of FIL-denominated transactions has it supported? [If possible, provide a numerical estimate]",
      "Any additional impact you feel your project has made, that is not covered through your earlier answers.",
    ],
  },
};
