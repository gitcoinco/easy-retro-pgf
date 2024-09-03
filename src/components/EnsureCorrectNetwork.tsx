import { type PropsWithChildren } from "react";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";
import { Button } from "./ui/Button";

export function EnsureCorrectNetwork({ children }: PropsWithChildren) {
  const { isCorrectNetwork, correctNetwork, switchChain } =
    useIsCorrectNetwork();
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
