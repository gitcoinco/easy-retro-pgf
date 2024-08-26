import { type Address } from "viem";

import { api } from "~/utils/api";

export function useApprovedVoter(address?: Address) {
  return api.voters.approved.useQuery(
    { address: address! },
    { enabled: Boolean(address) },
  );
}
