import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useBlockNumber } from "wagmi";

export function useWatch(queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey }).catch(console.log);
  }, [queryKey, blockNumber]);
}
