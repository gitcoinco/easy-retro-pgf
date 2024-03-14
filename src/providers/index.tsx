import { type PropsWithChildren } from "react";

import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
  frameWallet,
  injectedWallet,
  metaMaskWallet,
  braveWallet,
  safeWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, Connector, createConfig, WagmiConfig } from "wagmi";
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
import { MockConnector } from "wagmi/connectors/mock";
import {
  generatePrivateKey,
  mnemonicToAccount,
  privateKeyToAccount,
} from "viem/accounts";
import { Wallet } from "ethers";
import { createWalletClient, http } from "viem";
import {
  connectorsForTestWallet,
  createTestWallet,
  getTestWallet,
} from "./testWallet";

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: process.env.NEXT_PUBLIC_SIGN_STATEMENT ?? "Sign in to OpenPGF",
});

const { config, chains, appInfo } = createWagmiConfig();

export function Providers({
  children,
  session,
}: PropsWithChildren<{ session?: Session }>) {
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

function createWagmiConfig() {
  const activeChains: wagmiChains.Chain[] = [
    appConfig.config.network,
    wagmiChains.mainnet,
  ];

  // if (configuredChain) {
  //   activeChains.push(configuredChain);
  // }
  if (process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true") {
    activeChains.push(wagmiChains.optimismGoerli);
  }
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

  const connectors = connectorsForWallets(
    process.env.NEXT_PUBLIC_E2E_TEST
      ? getTestWallet()
      : projectId
        ? getDefaultWallets({ appName, chains, projectId }).wallets
        : getInjectedWallets({ appName, chains }),
  );

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
