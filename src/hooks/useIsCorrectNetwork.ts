import { useAccount, useNetwork } from "wagmi";
import { supportedNetworks } from "~/config";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";

export function useIsCorrectNetwork() {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const { data: round } = useCurrentRound();

  const network = supportedNetworks.find((n) => n.chain === round?.network);
  const isCorrectNetwork = isConnected && chain?.id === network?.id;

  return {
    isCorrectNetwork,
    correctNetwork: network,
  };
}
