import { useAccount } from "wagmi";
import { config } from "~/config";

export function useIsAdmin() {
  const { address } = useAccount();
  return config.admins.includes(address!);
}
