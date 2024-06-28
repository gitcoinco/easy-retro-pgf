"use client";

import { Card } from "~/components/ui/Card";
import { Heading } from "~/components/ui/Heading";

type SidebarCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function SidebarCard({
  title,
  description,
  children,
  className,
}: SidebarCardProps) {
  return (
    <Card className={`sticky top-4 w-[300px] ${className}`}>
      <div className="p-3">
        <Heading size="xl">{title}</Heading>
        <p className="mb-4 leading-relaxed">{description}</p>
      </div>
      {children}
    </Card>
  );
}
