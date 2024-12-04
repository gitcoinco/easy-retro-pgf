import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { config } from "~/config";

export function useIsCeloRound() {
  const router = useRouter();
  const [isCeloRound, setIsCeloRound] = useState<boolean | null>(null);

  useEffect(() => {
    setIsCeloRound(router.asPath.includes(config.celoRoundId));
  }, [router]);

  return isCeloRound;
}
