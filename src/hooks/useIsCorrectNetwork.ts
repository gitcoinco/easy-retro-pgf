import { useAccount, useNetwork } from "wagmi";
import { config } from "~/config";

export function useIsCorrectNetwork() {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const isCorrectNetwork = isConnected && chain?.id === config.network.id;

  return {
    isCorrectNetwork,
    correctNetwork: config.network,
  };
}
