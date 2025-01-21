import { getAddress } from "viem";
import * as allChains from "viem/chains";

export const metadata = {
  title: "Obol RAF",
  description: "Open-source Obol Retroactive Funding platform",
  url: "https://raf.obol.org",
  image: "/api/og",
};

export const config = {
  logoUrl: "",
  pageSize: 3 * 4,
  celoRoundId: process.env.NEXT_PUBLIC_CELO_ROUND2_DOMAIN_ID!,
  dripsRounds: process.env.NEXT_PUBLIC_DRIPS_ROUND_DOMAIN_IDS ? process.env.NEXT_PUBLIC_DRIPS_ROUND_DOMAIN_IDS!.split(",") : undefined,
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
  celo: "celo",
  avalanche: "avalanche",
  metis: "metis",
} as const;

export const nativeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
export const allo = {
  alloAddress: getAddress(process.env.NEXT_PUBLIC_ALLO2_ADDRESS!),
  strategyAddress: {
    [networks.mainnet]: "",
    [networks.optimism]: "0xff22f4ca9332f6e737a5e1522c034a3afc1b29fb",
    [networks.optimismSepolia]: "0xd652d4274a155ad0e1d5a1fd7f6ee844d8ec3388",
    [networks.arbitrum]: "",
    [networks.linea]: "",
    [networks.sepolia]: "",
    [networks.base]: "",
    [networks.baseGoerli]: "",
    [networks.celo]: "0x53a27a249518cb777e445a553b5ece124fd1a532",
    [networks.avalanche]: "0x5E3FF1a3B34c06Beb247b38484067c845cfe6fAE",
  },
};

export const theme = {
  colorMode: "light",
};

export const eas = {
  contracts: {
    [networks.mainnet]: {
      eas: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
      registry: "0xA7b39296258348C78294F95B872b282326A97BDF",
    },
    [networks.arbitrum]: {
      eas: "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458",
      registry: "0xA310da9c5B885E7fb3fbA9D66E9Ba6Df512b78eB",
    },
    [networks.celo]: {
      eas: "0x72E1d8ccf5299fb36fEfD8CC4394B8ef7e98Af92",
      registry: "0x5ece93bE4BDCF293Ed61FA78698B594F2135AF34",
      schemas: {
        metadata:
          "0xf01bd22db2b104f6a7096f3625307b1c03b863b73f08e71557ebf1adc20cf1bf",
        approval:
          "0xe2636f31239f7948afdd9a9c477048b7fc2a089c347af60e3aa1251e5bf63e5c",
      },
    },
    [networks.avalanche]: {
      eas: "0x96c8a2beA1f575f5Bb969476acF59A97a55cA655",
      registry: "0x87AFA1549ed770A7c2653829b1D182aE7D2b12b8",
      schemas: {
        metadata:
          "0xf01bd22db2b104f6a7096f3625307b1c03b863b73f08e71557ebf1adc20cf1bf",
        approval:
          "0xe2636f31239f7948afdd9a9c477048b7fc2a089c347af60e3aa1251e5bf63e5c",
      },
    },
    [networks.linea]: {
      eas: "0xaEF4103A04090071165F78D45D83A0C0782c2B2a",
      registry: "0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797",
    },
    [networks.sepolia]: {
      eas: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
      registry: "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
    },
    [networks.metis]: {
      eas: "0x5E3FF1a3B34c06Beb247b38484067c845cfe6fAE",
      registry: "0xa4Ab012Ba80B127E5B543719FFb50363D78C2564",
      schemas: {
        metadata:
          "0xd00c966351896bd3dc37d22017bf1ef23165f859d7546a2aba12a01623dec912",
        approval:
          "0x858e0bc94997c072d762d90440966759b57c8bca892d4c9447d2eeb205f14c69",
      },
    },
    default: {
      eas: "0x4200000000000000000000000000000000000021",
      registry: "0x4200000000000000000000000000000000000020",
      schemas: {
        approval:
          "0x858e0bc94997c072d762d90440966759b57c8bca892d4c9447d2eeb205f14c69",
        metadata:
          "0xd00c966351896bd3dc37d22017bf1ef23165f859d7546a2aba12a01623dec912",
      },
    },
  },
};

export const supportedNetworks = Object.values(networks).map((chain) => ({
  ...allChains[chain],
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
  [networks.celo]: "https://celo.easscan.org/graphql",
  [networks.avalanche]:
    "http://ec2-35-174-143-89.compute-1.amazonaws.com:32768/",
  [networks.metis]: "https://eas-metis-indexer.fly.dev/",
} as const;

// TODO: Remove and move to round config
export const impactCategories = {
  ETHEREUM_INFRASTRUCTURE: { label: "Ethereum Infrastructure" },
  OPEN_SOURCE: { label: "Web3 Open Source Software" },
  COMMUNITY_EDUCATION: { label: "Web3 Community & Education" },
  COLLECTIVE_GOVERNANCE: { label: "Collective Governance" },
  OP_STACK: { label: "OP Stack" },
  DEVELOPER_ECOSYSTEM: { label: "Developer Ecosystem" },
  END_USER_EXPERIENCE_AND_ADOPTION: { label: "End user UX" },
} as const;
