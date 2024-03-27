import * as wagmiChains from "wagmi/chains";

export const metadata = {
  title: "EasyRPGF",
  description: "Open-source Retro Public Goods Funding platform",
  url: "https://easy-retro-pgf.vercel.app",
  image: "/api/og",
};

export const config = {
  logoUrl: "",
  pageSize: 3 * 4,
};

export const nativeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
export const allo = {
  alloAddress: process.env.NEXT_PUBLIC_ALLO2_ADDRESS as `0x${string}`,
  strategyAddress: process.env.NEXT_PUBLIC_STRATEGY_ADDRESS as `0x${string}`,
};

export const theme = {
  colorMode: "light",
};

export const eas = {
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

export const networks = {
  mainnet: "mainnet",
  optimism: "optimism",
  optimismSepolia: "optimismSepolia",
  arbitrum: "arbitrum",
  linea: "linea",
  sepolia: "sepolia",
  base: "base",
  baseGoerli: "baseGoerli",
} as const;
export const supportedNetworks = Object.values(networks).map((chain) => ({
  ...wagmiChains[chain],
  chain,
}));
export const networkNames = Object.fromEntries(
  supportedNetworks.map((network) => [network.chain, network.name]),
);

export const easApiEndpoints = {
  [networks.mainnet]: "https://easscan.org/graphql",
  [networks.optimism]: "https://optimism.easscan.org/graphql",
  [networks.optimismSepolia]: "https://optimism-sepolia.easscan.org/graphql",
  [networks.arbitrum]: "https://arbitrum.easscan.org/graphql",
  [networks.linea]: "https://linea.easscan.org/graphql",
  [networks.sepolia]: "https://sepolia.easscan.org/graphql",
  [networks.base]: "https://base.easscan.org/graphql",
  [networks.baseGoerli]: "https://base-goerli.easscan.org/graphql",
} as const;

export const impactCategories = {
  ETHEREUM_INFRASTRUCTURE: { label: "Ethereum Infrastructure" },
  OPEN_SOURCE: { label: "Web3 Open Source Software" },
  COMMUNITY_EDUCATION: { label: "Web3 Community & Education" },
  COLLECTIVE_GOVERNANCE: { label: "Collective Governance" },
  OP_STACK: { label: "OP Stack" },
  DEVELOPER_ECOSYSTEM: { label: "Developer Ecosystem" },
  END_USER_EXPERIENCE_AND_ADOPTION: { label: "End user UX" },
} as const;
