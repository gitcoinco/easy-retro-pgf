import { parseAbi, parseEther } from "viem";
import { useAccount, useContractWrite } from "wagmi";
import { Button } from "~/components/ui/Button";
import { allo } from "~/config";

export function MintButton() {
  const { address } = useAccount();
  const mint = useContractWrite({
    address: allo.tokenAddress,
    abi: parseAbi(["function mint(address to, uint256 amount)"]),
    functionName: "mint",
    args: [address!, parseEther("10000")],
  });
  return (
    <Button
      disabled={mint.isLoading}
      className={"mt-1 w-full"}
      onClick={() => mint.write()}
    >
      Mint tokens (TEST MODE)
    </Button>
  );
}
