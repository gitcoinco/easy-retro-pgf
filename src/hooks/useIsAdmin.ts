import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { useSessionAddress } from "./useSessionAddress";

export function useIsAdmin() {
  const { address } = useSessionAddress();
  const round = useCurrentRound();
  return round.data?.admins.includes(address!);
}
