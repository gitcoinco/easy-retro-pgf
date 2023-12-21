import { Avatar } from "~/components/ui/Avatar";
import { type Address, useEnsAvatar, useEnsName } from "wagmi";
import { truncate } from "~/utils/truncate";

export function AvatarENS({ address }: { address: Address }) {
  const { data: name } = useEnsName({
    address,
    chainId: 1,
    enabled: Boolean(address),
  });

  const { data: src } = useEnsAvatar({ name, enabled: Boolean(name) });
  return (
    <div className="flex items-center gap-2">
      <Avatar rounded="full" size="xs" src={src} />
      <div>{name ?? truncate(address)}</div>
    </div>
  );
}

export function NameENS({ address }: { address?: Address }) {
  const { data: name } = useEnsName({
    address,
    chainId: 1,
    enabled: Boolean(address),
  });

  return <div>{name ?? truncate(address)}</div>;
}
