import { type Address } from "viem";

import { useQuery } from "@tanstack/react-query";
import { fetchApprovedVoter } from "~/utils/fetchApprovedVoter";

export function useApprovedVoter(address: Address) {
  return useQuery(["badgeholder", address], () => fetchApprovedVoter(address), {
    enabled: Boolean(address),
  });
}
