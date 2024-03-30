import { useAccount, useChainId } from "wagmi";
import { config } from "~/config";

export function useIsCorrectNetwork() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const isCorrectNetwork = isConnected && chainId === config.network.id;

  return {
    isCorrectNetwork,
    correctNetwork: config.network,
  };
}
