import { signOut, useSession } from "next-auth/react";
import type { PropsWithChildren } from "react";
import { useAccountEffect } from "wagmi";

export function EnsureCorrectSession({ children }: PropsWithChildren) {
  const { data: session } = useSession();
  const sessionAddress = session?.user?.name;

  useAccountEffect({
    onConnect({ address }) {
      if (sessionAddress && address !== sessionAddress) {
        void signOut({ redirect: false });
      }
    },
  });

  return <>{children}</>;
}
