import { useMemo, type PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";

import {
  frameWallet,
  injectedWallet,
  metaMaskWallet,
  safeWallet,
  coinbaseWallet,
  walletConnectWallet,
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import * as allChains from "viem/chains";
import type { Chain } from "viem/chains";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { ThemeProvider } from "next-themes";
import {
  RainbowKitSiweNextAuthProvider,
  type GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";

import * as appConfig from "~/config";
import { Toaster } from "~/components/Toaster";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: process.env.NEXT_PUBLIC_SIGN_STATEMENT ?? "Sign in to OpenPGF",
});

const queryClient = new QueryClient();

export function Providers({
  children,
  session,
}: PropsWithChildren<{ session?: Session }>) {
  const { data: round } = useCurrentRound();

  const network = round?.network;
  const config = useMemo(() => createWagmiConfig(network), [network]);

  return (
    <ThemeProvider attribute="class" forcedTheme={appConfig.theme.colorMode}>
      <SessionProvider refetchInterval={0} session={session}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitSiweNextAuthProvider
              getSiweMessageOptions={getSiweMessageOptions}
            >
              <RainbowKitProvider>
                {children}
                <Toaster />
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

function createWagmiConfig(network?: string | null) {
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
        walletConnectWallet,
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

  const chains = [allChains.mainnet] as [Chain, ...Chain[]];

  if (network) chains.push(allChains[network as keyof typeof allChains]);
  else chains.push(...appConfig.supportedNetworks);

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
  return createConfig({ connectors, chains, transports });
}
