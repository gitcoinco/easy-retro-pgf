import { useCurrentDomain } from "./useRound";

const domainsToShowActualVotes: string[] = ["libp2p-r-pgf-1"];

export function useIsShowActualVotes() {
  const domain = useCurrentDomain();
  return domainsToShowActualVotes.includes(domain);
}
