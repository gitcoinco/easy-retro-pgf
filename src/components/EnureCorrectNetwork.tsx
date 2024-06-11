import { type PropsWithChildren } from "react";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { Button } from "./ui/Button";
import { useSwitchChain } from "wagmi";

export function EnsureCorrectNetwork({ children }: PropsWithChildren) {
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();
  const { switchChain } = useSwitchChain();
  if (!isCorrectNetwork)
    return (
      <Button
        onClick={() => switchChain({ chainId: correctNetwork?.id as number })}
      >
        Change network
      </Button>
    );
  return <>{children}</>;
}
