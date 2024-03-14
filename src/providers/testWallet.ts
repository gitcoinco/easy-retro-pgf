import * as wagmiChains from "wagmi/chains";

import * as appConfig from "~/config";
import { MockConnector } from "wagmi/connectors/mock";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";

export function getTestWallet() {
  const walletClient = createWalletClient({
    account: privateKeyToAccount(
      (process.env.NEXT_PUBLIC_TEST_WALLET_PRIVATE_KEY as `0x${string}`) ??
        generatePrivateKey(),
    ),
    chain: wagmiChains.mainnet,
    transport: http(),
  });

  const connector = {
    createConnector: () => ({
      connector: new MockConnector({
        chains: [appConfig.config.network],
        options: {
          walletClient,
          flags: {
            failConnect: false,
            failSwitchChain: false,
            isAuthorized: true,
            noSwitchChain: false,
          },
        },
      }),
    }),
    id: "mock",
    iconBackground: "tomato",
    iconUrl: async () => "http://placekitten.com/100/100",
    name: "Mock Wallet",
  };

  return [{ groupName: "Testing", wallets: [connector] }];
}
