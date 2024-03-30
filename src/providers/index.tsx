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
import * as wagmiChains from "wagmi/chains";
import type { Chain } from "wagmi/chains";
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

  const config = useMemo(
    () => createWagmiConfig(round?.network),
    [round],
  );

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
  
  const chains = [ wagmiChains.mainnet] as [
    Chain,
    ...Chain[],
  ];

  if (network) chains.push(wagmiChains[network as keyof typeof wagmiChains]);
  else chains.push(...appConfig.supportedNetworks);

  const transports = Object.fromEntries(
    chains.map((chain) => [chain.id, http()]),
  );
  return createConfig({ connectors, chains, transports });
}
