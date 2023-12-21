import "~/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Inter } from "next/font/google";

import type { AppProps } from "next/app";
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

import { api } from "~/utils/api";
import { metadata, theme } from "~/config";

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: process.env.NEXT_PUBLIC_SIGN_STATEMENT ?? "Sign in to OpenPGF",
});

const { config, chains, appInfo } = createWagmiConfig();
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <ThemeProvider attribute="class" forcedTheme={theme.colorMode}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <WagmiConfig config={config}>
          <RainbowKitSiweNextAuthProvider
            getSiweMessageOptions={getSiweMessageOptions}
          >
            <RainbowKitProvider appInfo={appInfo} chains={chains}>
              <style jsx global>{`
                :root {
                  --font-inter: ${inter.style.fontFamily};
                }
              `}</style>
              <main className={`${inter.variable} font-sans`}>
                <Component {...pageProps} />
              </main>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </WagmiConfig>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default api.withTRPC(MyApp);

function createWagmiConfig() {
  const activeChains: wagmiChains.Chain[] = [wagmiChains.mainnet];

  const configuredChain: wagmiChains.Chain | undefined =
    wagmiChains[process.env.NEXT_PUBLIC_CHAIN_NAME as keyof typeof wagmiChains];

  if (configuredChain) {
    activeChains.push(configuredChain);
  }
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
  const appName = metadata.title;

  const { wallets } = getDefaultWallets({ appName, projectId, chains });

  const appInfo = { appName };

  const connectors = connectorsForWallets([
    ...wallets,
    {
      groupName: "Other",
      wallets: [
        argentWallet({ projectId, chains }),
        trustWallet({ projectId, chains }),
        ledgerWallet({ projectId, chains }),
        frameWallet({ chains }),
      ],
    },
  ]);

  const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });

  return { chains, config, appInfo };
}
