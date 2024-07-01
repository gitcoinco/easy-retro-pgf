import React from "react";
import { SidebarCard } from "./SidebarCard";

type SidebarPlaceholderProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function SidebarPlaceholder({
  title = "",
  children,
  className,
}: SidebarPlaceholderProps) {
  return (
    <SidebarCard title={title} className={className}>
      <div className="flex h-96 items-center justify-center">{children}</div>
    </SidebarCard>
  );
}
