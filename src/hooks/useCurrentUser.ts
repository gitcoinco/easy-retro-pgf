import { useCurrentRound } from "~/features/rounds/hooks/useRound";
import { useApprovedVoter } from "~/features/voters/hooks/useApprovedVoter";
import { useSessionAddress } from "./useSessionAddress";

export function useCurrentUser() {
  const { address } = useSessionAddress();
  const { data: round, isPending: roundIsPending } = useCurrentRound();
  const { data: approvedVoterData, isPending: approvedVoterIsPending } =
    useApprovedVoter(address);

  if (!address) {
    return {
      address,
      isAdmin: false,
      isPending: false,
      isVoter: false,
    };
  }

  const isAdmin = round?.admins.includes(address as string);

  // useApprovedVoter returns a number, is a Voter is the number is greater than 0
  const isVoter =
    approvedVoterData !== undefined ? approvedVoterData > 0 : approvedVoterData;

  return {
    address,
    isAdmin,
    isPending: roundIsPending || approvedVoterIsPending,
    isVoter,
  };
}
