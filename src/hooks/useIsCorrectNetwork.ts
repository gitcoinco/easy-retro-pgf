import { supportedNetworks } from "~/config";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { useAccount, useChainId } from "wagmi";
import { useSwitchChain } from "wagmi";
import { useEffect } from "react";

export function useIsCorrectNetwork(
  opts: { force: boolean } = { force: false },
) {
  const forceChange = opts.force;

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const { data: round } = useCurrentRound();

  const network = supportedNetworks.find((n) => n.chain === round?.network);
  const isCorrectNetwork = isConnected && chainId === network?.id;

  useEffect(() => {
    if (forceChange && isConnected && !isCorrectNetwork) {
      switchChain({ chainId: network?.id as number });
    }
  }, [forceChange, isConnected, isCorrectNetwork, network]);

  return {
    switchChain,
    isCorrectNetwork,
    correctNetwork: network,
  };
}
