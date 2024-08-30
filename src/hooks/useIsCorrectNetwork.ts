import { supportedNetworks } from "~/config";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { useAccount, useChainId } from "wagmi";
import { useSwitchChain } from "wagmi";

export function useIsCorrectNetwork() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const { data: round } = useCurrentRound();

  const network = supportedNetworks.find((n) => n.chain === round?.network);
  const isCorrectNetwork = isConnected && chainId === network?.id;

  const switchToCorrectChain = () => {
    switchChain({ chainId });
  };

  return {
    switchChain,
    switchToCorrectChain,
    isCorrectNetwork,
    correctNetwork: network,
  };
}
