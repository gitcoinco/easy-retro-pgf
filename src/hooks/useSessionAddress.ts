import { useSession } from "next-auth/react";

export function useSessionAddress() {
  const { data: session } = useSession();
  const address = (session?.user?.name ?? undefined) as
    | `0x${string}`
    | undefined;

  return { address };
}
