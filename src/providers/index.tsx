import { useMemo, type PropsWithChildren } from "react";

import {
  type Chain,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { http, WagmiProvider } from "wagmi";
import { ThemeProvider } from "next-themes";

import * as appConfig from "~/config";
import { Toaster } from "~/components/Toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MaciProvider } from "~/contexts/Maci";
import { BallotProvider } from "~/contexts/Ballot";

export function Providers({ children }: PropsWithChildren) {
  const { config, queryClient } = useMemo(() => createWagmiConfig(), []);

  return (
    <ThemeProvider attribute="class" forcedTheme={appConfig.theme.colorMode}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <MaciProvider>
              <BallotProvider>{children}</BallotProvider>
              <Toaster />
            </MaciProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

function createWagmiConfig() {
  const activeChains: Chain[] = [appConfig.config.network];

  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID!;
  const appName = appConfig.metadata.title;

  const queryClient = new QueryClient();

  const config = getDefaultConfig({
    appName,
    projectId,
    ssr: false,
    chains: activeChains as unknown as readonly [Chain, ...Chain[]],
    transports: {
      [appConfig.config.network.id]: http(
        `https://opt-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID!}`,
      ),
    },
  });

  return { config, queryClient };
}
