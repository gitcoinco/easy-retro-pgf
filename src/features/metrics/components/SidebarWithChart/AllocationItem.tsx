import { PropsWithChildren } from "react";
import { Skeleton } from "~/components/ui/Skeleton";
import AvatarPlaceholder from "../../../../../public/avatarPlaceholder.svg";

export function AllocationItem({
  name,
  image = AvatarPlaceholder.src,
  children,
}: PropsWithChildren & { name?: string; image?: string }) {
  return (
    <div className="text-muted-foreground flex flex-1 items-center justify-between border-b py-2 text-xs">
      <div className="flex items-center gap-2">
        <div
          className="size-6 rounded-lg bg-gray-100 bg-cover bg-center"
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
        <div>{name ?? <Skeleton className="h-3 w-16" />}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}
