import { useRouter } from "next/router";
import { SortByDropdown } from "./SortByDropdown";
import { type Filter } from "~/features/filter/types";
import {
  toURL,
  useUpdateFilterFromRouter,
} from "~/features/filter/hooks/useFilter";

type Props = {
  type: "projects" | "lists";
  filter: Filter;
  sortOptions: string[];
};

export const SortFilter = ({ type, filter, sortOptions }: Props) => {
  const router = useRouter();
  const query = router.query as unknown as Filter;

  useUpdateFilterFromRouter(type);

  return (
    <div className="mb-2 flex gap-2">
      <SortByDropdown
        options={sortOptions}
        value={`${filter?.orderBy}_${filter?.sortOrder}`}
        onChange={(sort) => {
          const [orderBy, sortOrder] = sort.split("_");
          void router.push(
            `/${type}?${toURL(query, { orderBy, sortOrder })}`,
            undefined,
            { scroll: false },
          );
        }}
      />
    </div>
  );
};
