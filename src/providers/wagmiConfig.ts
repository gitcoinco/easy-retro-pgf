import { createConfig, http } from "wagmi";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

import {
  argentWallet,
  trustWallet,
  ledgerWallet,
  frameWallet,
  injectedWallet,
  metaMaskWallet,
  safeWallet,
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import * as allChains from "viem/chains";

import * as appConfig from "~/config";

export function createWagmiConfig() {
  const appName = appConfig.metadata.title;
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID!;

  const wallets = [
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet,
        injectedWallet,
        safeWallet,
        coinbaseWallet,
        frameWallet,
        ledgerWallet,
        argentWallet,
        trustWallet,
        ...(projectId ? [walletConnectWallet] : []),
      ],
    },
  ];

  const connectors = connectorsForWallets(wallets, {
    projectId,
    appName,
    walletConnectParameters: {
      // TODO: Define these
      metadata: {
        name: appName,
        description: appName,
        url: global.location?.href,
        icons: [],
      },
    },
  });

  const chains = appConfig.supportedNetworks as unknown as [
    allChains.Chain,
    ...allChains.Chain[],
  ];

  const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID;

  const networkMap: Record<string, string> = {
    [allChains.mainnet.id]: "eth-mainnet",
    [allChains.optimism.id]: "opt-mainnet",
    [allChains.optimismSepolia.id]: "opt-sepolia",
    [allChains.arbitrum.id]: "arb-mainnet",
    [allChains.base.id]: "base-mainnet",
    [allChains.baseGoerli.id]: "base-goerli",
  };

  const transports = Object.fromEntries(
    chains.map((chain) => {
      const _network = networkMap[chain.id];
      return [
        chain.id,
        http(
          alchemyApiKey && _network
            ? `https://${_network}.g.alchemy.com/v2/${alchemyApiKey}`
            : undefined,
        ),
      ];
    }),
  );
  return createConfig({ connectors, chains, transports, ssr: true });
}
