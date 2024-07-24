import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useBlockNumber } from "wagmi";
import { useIsCorrectNetwork } from "./useIsCorrectNetwork";

export function useWatch(queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();

  const { isCorrectNetwork } = useIsCorrectNetwork();
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    query: { enabled: isCorrectNetwork },
  });
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey }).catch(console.log);
  }, [queryKey, blockNumber]);
}
