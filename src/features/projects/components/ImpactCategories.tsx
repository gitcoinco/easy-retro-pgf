import { Tag } from "~/components/ui/Tag";
import { impactCategories } from "~/config";

export const ImpactCategories = ({ tags }: { tags?: string[] }) => (
  <div className="no-scrollbar">
    <div className="flex gap-1 overflow-x-auto">
      {tags?.map((key) => (
        <Tag key={key} size="sm">
          {impactCategories[key as keyof typeof impactCategories]?.label ?? key}
        </Tag>
      ))}
    </div>
  </div>
);
