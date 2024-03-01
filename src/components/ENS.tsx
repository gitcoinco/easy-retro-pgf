import { Avatar } from "~/components/ui/Avatar";
import { useEnsAvatar, useEnsName } from "wagmi";
import { truncate } from "~/utils/truncate";
import type { Address } from "viem";

export function AvatarENS({ address }: { address: Address }) {
  const { data: name } = useEnsName({
    address,
    chainId: 1,
    query: {
      enabled: Boolean(address),
    },
  });

  const { data: src } = useEnsAvatar({
    name: name ?? undefined,
    query: { enabled: Boolean(name) },
  });
  return (
    <div className="flex items-center gap-2">
      <Avatar rounded="full" size="xs" src={src} />
      <div>{name ?? truncate(address)}</div>
    </div>
  );
}

export function NameENS({ address }: { address?: string }) {
  const { data: name } = useEnsName({
    address: address as Address,
    chainId: 1,
    query: {
      enabled: Boolean(address),
    },
  });

  return <div>{name ?? truncate(address)}</div>;
}
