import { type ComponentProps } from "react";
import { type Address } from "viem";
import { normalize } from "viem/ens";
import { useEnsAvatar, useEnsName } from "wagmi";
import { Avatar } from "~/components/ui/Avatar";
import { truncate } from "~/utils/truncate";

export function AvatarENS({
  address,
  ...props
}: { address: string } & ComponentProps<typeof Avatar>) {
  const { data: name } = useEnsName({
    address: address as Address,
    chainId: 1,
    query: { enabled: Boolean(address) },
  });

  const { data: src } = useEnsAvatar({
    name: normalize(name!),
    query: { enabled: Boolean(name) },
  });
  return <Avatar rounded="full" size="xs" src={src} {...props} />;
}

export function NameENS({
  address,
  truncateLength,
}: {
  address?: string;
  truncateLength?: number;
}) {
  const { data: name } = useEnsName({
    address: address as Address,
    chainId: 1,
    query: { enabled: Boolean(address) },
  });

  return <div>{name ?? truncate(address, truncateLength)}</div>;
}
