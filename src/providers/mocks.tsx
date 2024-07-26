import { mock } from "wagmi/connectors";
import { useAccount, useConnect } from "wagmi";
import { ConnectButtonRendererProps } from "node_modules/@rainbow-me/rainbowkit/dist/components/ConnectButton/ConnectButtonRenderer";

export const mockConnector = mock({
  accounts: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
});

export function MockConnectButton({ children }: ConnectButtonRendererProps) {
  const { address, chain } = useAccount();
  const { connect } = useConnect();
  return children({
    account: address
      ? {
          address: String(address),
          displayName: "mock",
          hasPendingTransactions: false,
        }
      : undefined,
    chain: chain
      ? { id: chain.id, name: chain.name, hasIcon: false }
      : undefined,
    openConnectModal: () => connect({ connector: mockConnector }),
    mounted: true,
    openChainModal: () => {},
    openAccountModal: () => {},
    accountModalOpen: false,
    chainModalOpen: false,
    connectModalOpen: false,
  });
}
