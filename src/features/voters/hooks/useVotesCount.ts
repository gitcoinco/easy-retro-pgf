import { useQuery } from "@tanstack/react-query";
import { api } from "~/utils/api";

export function useVotesCount(voterAddress: string) {
  const { data: round } = api.rounds.get.useQuery();

  return useQuery({
    queryKey: ["voterCount", voterAddress, round?.id],
    queryFn: async () => {
      const voter = await api.voters.get.query({ voterId: voterAddress });
      return (
        voter ?? {
          maxVotesTotal: round?.maxVotesTotal ?? 0,
          maxVotesProject: round?.maxVotesProject ?? 0,
        }
      );
    },
    enabled: !!voterAddress && !!round,
  });
}
