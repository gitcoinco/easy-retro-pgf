import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";

import { metadata } from "~/config";
import { Dialog } from "./ui/Dialog";
import { useApprovedVoter } from "~/features/voters/hooks/useApprovedVoter";

export const EligibilityDialog = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data, isLoading, error } = useApprovedVoter(address!);

  if (isLoading || !address || error) return null;

  return (
    <Dialog
      size="sm"
      isOpen={!data}
      onOpenChange={() => disconnect()}
      title={
        <>
          You are not eligible to vote <span className="font-serif">😔</span>
        </>
      }
    >
      <div>
        Only badgeholders are able to vote in {metadata.title}. You can find out
        more about how badgeholders are selected{" "}
        <Link href="" target="_blank" className="underline underline-offset-2">
          here
        </Link>
        .
      </div>
    </Dialog>
  );
};
