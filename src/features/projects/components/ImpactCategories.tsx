import { useMemo } from "react";
import { Tag } from "~/components/ui/Tag";
import { useCurrentRound } from "~/features/rounds/hooks/useRound";

export const ImpactCategories = ({ tags }: { tags?: string[] }) => {
  const { data: round } = useCurrentRound();

  const categoriesByKey = useMemo(
    () =>
      Object.fromEntries(
        round?.categories?.map((cat) => [cat.id, cat.label]) ?? [],
      ),
    [round],
  );

  console.log({ categoriesByKey });
  return (
    <div className="no-scrollbar">
      <div className="flex gap-1 overflow-x-auto">
        {tags?.map((key) => (
          <Tag key={key} size="sm">
            {categoriesByKey[key as keyof typeof categoriesByKey] ?? key}
          </Tag>
        ))}
      </div>
    </div>
  );
};
