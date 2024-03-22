import { useAccount } from "wagmi";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";

export function useIsAdmin() {
  const { address } = useAccount();
  const round = useCurrentRound();
  return round.data?.admins.includes(address!);
}
