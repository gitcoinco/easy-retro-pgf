import { useMemo, type PropsWithChildren } from "react";

import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  frameWallet,
  injectedWallet,
  braveWallet,
  safeWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import * as wagmiChains from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
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

export function Providers({
  children,
  session,
}: PropsWithChildren<{ session?: Session }>) {
  const { data: round } = useCurrentRound();

  const { config, chains, appInfo } = useMemo(
    () => createWagmiConfig(round?.network as keyof typeof wagmiChains),
    [round],
  );

  return (
    <ThemeProvider attribute="class" forcedTheme={appConfig.theme.colorMode}>
      <SessionProvider refetchInterval={0} session={session}>
        <WagmiConfig config={config}>
          <RainbowKitSiweNextAuthProvider
            getSiweMessageOptions={getSiweMessageOptions}
          >
            <RainbowKitProvider appInfo={appInfo} chains={chains}>
              {children}
              <Toaster />
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </WagmiConfig>
      </SessionProvider>
    </ThemeProvider>
  );
}

function createWagmiConfig(network?: keyof typeof wagmiChains) {
  const activeChains: wagmiChains.Chain[] = [wagmiChains.mainnet];

  if (network) activeChains.push(wagmiChains[network]);

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    activeChains,
    [
      alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
      publicProvider(),
    ],
  );

  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID!;
  const appName = appConfig.metadata.title;

  const appInfo = { appName };

  const connectors = projectId
    ? connectorsForWallets(
        getDefaultWallets({ appName, chains, projectId }).wallets,
      )
    : connectorsForWallets(getInjectedWallets({ appName, chains }));

  const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });

  return { chains, config, appInfo };
}

function getInjectedWallets({
  appName,
  chains,
}: {
  appName: string;
  chains: wagmiChains.Chain[];
}) {
  return [
    {
      groupName: "Popular",
      wallets: [
        injectedWallet({ chains }),
        safeWallet({ chains }),
        coinbaseWallet({ appName, chains }),
        braveWallet({ chains }),
        frameWallet({ chains }),
      ],
    },
  ];
}
