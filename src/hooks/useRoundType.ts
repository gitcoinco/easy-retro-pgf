import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { config } from "~/config";

export function useRoundType() {
  const router = useRouter();
  const [isCeloRound, setIsCeloRound] = useState<boolean | null>(null);
  const [isDripRound, setIsDripRound] = useState<boolean | null>(null);
  const [isOtherRound, setIsOtherRound] = useState<boolean | null>(null);

  useEffect(() => {
    const isCeloRound = router.asPath.includes(config.celoRoundId);

    const isDripRound = config.dripsRounds?.some((round) =>
      router.asPath.includes(round),
    ) || false;
    setIsCeloRound(isCeloRound);
    setIsDripRound(isDripRound);
    setIsOtherRound(!(isCeloRound ?? isDripRound));
  }, [router]);
  const roundType = isCeloRound ? "CELO" : isDripRound ? "DRIP" : isOtherRound;

  return roundType;
}
