import { useFormContext } from "react-hook-form";
import { type Address, erc20Abi } from "viem";
import { useReadContracts } from "wagmi";

export function TokenSymbol() {
  const address = useFormContext<{ tokenAddress: Address }>().watch(
    "tokenAddress",
  );

  const result = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });
  result.data;

  return <>{result.data?.[0]}</>;
}
