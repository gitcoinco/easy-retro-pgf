import { supportedNetworks } from "~/config";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { useAccount, useChainId } from "wagmi";
import { useSwitchChain } from "wagmi";

export function useIsCorrectNetwork(
  opts: { force: boolean } = { force: false },
) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const { data: round } = useCurrentRound();

  const network = supportedNetworks.find((n) => n.chain === round?.network);
  const isCorrectNetwork = isConnected && chainId === network?.id;

  if (opts.force && isConnected && !isCorrectNetwork) {
    switchChain({ chainId: network?.id as number });
  }

  return {
    switchChain,
    isCorrectNetwork,
    correctNetwork: network,
  };
}
