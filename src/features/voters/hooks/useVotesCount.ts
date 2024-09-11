import { api } from "~/utils/api";

export function useVotesCount(voterAddress: string) {
  return api.voters.voteCountPerAddress.useQuery(
    { address: voterAddress },
    { enabled: !!voterAddress },
  );
}
