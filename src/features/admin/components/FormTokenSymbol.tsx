import { useFormContext } from "react-hook-form";
import { isAddress } from "viem";
import { type Address, useToken } from "wagmi";

export function TokenSymbol() {
  const address = useFormContext<{ tokenAddress: Address }>().watch(
    "tokenAddress",
  );

  const token = useToken({
    address,
    enabled: isAddress(address),
  });
  return <>{token.data?.symbol}</>;
}
